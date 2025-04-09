import mongoose from "mongoose";
import { BADREQUEST, INTERNALERROR, OK } from "../constants/httpStatus.js";
import { responseMessages } from "../constants/responseMessage.js";
import { sendEmailNotification } from "../helpers/mailFunc.js";
import Alert from "../models/Alert.js";
import Notification from "../models/Notification.js";
import Visitor from "../models/Visitor.js";
import { Queue, tryCatch } from 'bullmq';
import ServiceCategory from "../models/ServiceCategories.js";


// Create Notification
export const createNotificationController = async (req, res) => {
    const { title, message, sentTo, email } = req.body;
    try {
        if (!title || !message) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Title and message are required"
            })
        };

        const notification = new Notification({ title, message, sentTo: sentTo });
        const savedNotification = await notification.save();
        if (savedNotification.errors) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Notification not saved"
            })
        } else {
            await sendEmailNotification(email, savedNotification.message, savedNotification.title);
            return res.status(OK).json({
                success: true,
                message: responseMessages.ADD_SUCCESS_MESSAGES,
                data: savedNotification
            })
        };


    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: "Something went wrong"
        })
    }
};

// Get High Footfall Areas
export const getHighFootfallAreas = async (req, res) => {
    try {
        const highFootfallAreas = await Visitor.aggregate([
            {
                $group: {
                    _id: "$office",
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "offices",
                    localField: "_id",
                    foreignField: "_id",
                    as: "office"
                }
            },
            {
                $unwind: "$office"
            },
            {
                $project: {
                    count: 1,
                    _id: 1,
                    officeName: "$office.officeName",
                    floorNumber: "$office.floorNumber",
                    capacity: "$office.capacity",
                }
            },
            {
                $sort: {
                    count: -1
                }
            },
            {
                $limit: 5
            }
        ]);

        if (!highFootfallAreas) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "No high footfall areas found"
            })
        };

        return res.status(OK).json({
            success: true,
            message: responseMessages.GET_SUCCESS_MESSAGES,
            data: highFootfallAreas
        })

    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
};


// Create Alert 
export const createAlertController = async (req, res) => {
    const { type, description, status, severity, location,relatedEntity, reportedBy, assignedTo, actionTaken, notificationSent } = req.body;
    try {
        if(!type || !description || !severity || !location || !reportedBy){
            return res.status(BADREQUEST).json({
                success: false,
                message: responseMessages.MISSING_FIELDS
            })
        };

        const alert = new Alert({ type, description, status, severity, location,relatedEntity, reportedBy, assignedTo, actionTaken, notificationSent });
        const savedAlert = await alert.save();
        if (savedAlert.errors) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Alert not saved"
            })
        } else {
            return res.status(OK).json({
                success: true,
                message: responseMessages.ADD_SUCCESS_MESSAGES,
                data: savedAlert
            })
        };


   
    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: "Something went wrong"
        })
    }
};


export const getAllAlertsController = async (req, res)=>{
    const {page, limit} = req.query;
    const userId = req.user._id;
    try {
       const alerts = await Alert.find(
        {
            readBy: { $ne: userId }
        }
       ).sort({createdAt:-1}).skip((page-1)*limit).limit(limit);
       if(!alerts){
        return res.status(BADREQUEST).json({
            success: false,
            message: "No alerts found"
        })
       };
       return res.status(OK).json({
        success: true,
        message: responseMessages.GET_SUCCESS_MESSAGES,
        data: alerts
    })
    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: "Something went wrong"
        })
    }
};

// Get Alert By Id
export const getAlertsByService = async (req, res)=>{
    const {id} = req.params;
    
    try {
        if(!mongoose.Types.ObjectId.isValid(id) || !id){
            return res.status(BADREQUEST).json({
                success: false,
                message: responseMessages.MISSING_FIELDS
            })
        };

        const alerts = await Alert.aggregate([
            {
                $match: {
                    reportedBy: new mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "reportedBy",
                    foreignField: "_id",
                    as: "reportedBy"
                }
            },
            {
                $unwind: {
                    path: "$reportedBy",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "servicecategories",
                    localField: "assignedTo",
                    foreignField: "_id",
                    as: "assignedTo"
                }
            },
            {
                $unwind: {
                    path: "$assignedTo",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    type: 1,
                    description: 1,
                    status: 1,
                    severity: 1,
                    location: 1,
                    relatedEntity: 1,
                    reportedBy:{
                        _id: "$reportedBy._id",
                        username: "$reportedBy.username",
                        email: "$reportedBy.email",
                        createdAt: "$reportedBy.createdAt",
                        updatedAt: "$reportedBy.updatedAt"
                    },
                    assignedTo: {
                        _id: "$assignedTo._id",
                        name: "$assignedTo.name",
                        createdAt: "$assignedTo.createdAt",
                        updatedAt: "$assignedTo.updatedAt"
                    },
                    actionTaken: 1,
                    notificationSent: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
            

            
            
        ]);
        if(!alerts){
            return res.status(BADREQUEST).json({
                success: false,
                message: "No alerts found"
            })
        };
        return res.status(OK).json({
            success: true,
            message: responseMessages.GET_SUCCESS_MESSAGES, 
            data: alerts
        })
        
    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
};

export const getAlertsByType = async (req, res)=>{
    const {name} = req.params;
    try {
        const regex = new RegExp(name, 'i');

        const alerts = await Alert.aggregate([
            {
                $match: {
                    type: regex
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "reportedBy",
                    foreignField: "_id",
                    as: "reportedBy"
                }
            },
            {
                $unwind: {
                    path: "$reportedBy",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "servicecategories",
                    localField: "assignedTo",
                    foreignField: "_id",
                    as: "assignedTo"
                }
            },            
            {
                $unwind: {
                    path: "$assignedTo",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    type: 1,
                    description: 1,
                    status: 1,
                    severity: 1,
                    location: 1,
                    relatedEntity: 1,
                    reportedBy: {
                        _id: "$reportedBy._id",
                        username: "$reportedBy.username",
                        email: "$reportedBy.email",
                        createdAt: "$reportedBy.createdAt",
                        updatedAt: "$reportedBy.updatedAt"
                    },
                    assignedTo: {
                        _id: "$assignedTo._id",
                        name: "$assignedTo.name",
                        createdAt: "$assignedTo.createdAt",
                        updatedAt: "$assignedTo.updatedAt"
                    },
                    actionTaken: 1,
                    notificationSent: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]);
        if(!alerts){
            return res.status(BADREQUEST).json({
                success: false,
                message: "No alerts found"
            })
        };
        return res.status(OK).json({
            success: true,
            message: responseMessages.GET_SUCCESS_MESSAGES,
            data: alerts
        });
    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
};

export const getAlertsStatsController = async (req, res)=>{
    try {
        const stats = await Alert.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: {
                        $sum: 1
                    }
                }
            },

            {
                $project: {
                    _id: 0,
                    status: "$_id",
                    count: 1
                }
            }
           
        ])

        const totalAlert = await Alert.countDocuments();
        const resolvedAlert = await Alert.countDocuments({status: "Resolved"});
        const pendingAlert = await Alert.countDocuments({status: "Unresolved"});
        const securityAlert = await Alert.countDocuments({type: "Security"});


        return res.status(OK).json({
            success: true,
            message: responseMessages.GET_SUCCESS_MESSAGES,
            data:{
                totalAlert: totalAlert,
                UnresolvedAlert: pendingAlert,
                resolvedAlert: resolvedAlert,
                securityAlert: securityAlert,
            }
        })
    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
};

// Update Alert
// Update Alert - Mark as Read
export const markAllAlertsAsReadController = async (req, res) => {
    const userId = req.user._id;  // Get the user ID from the request

    try {
        // Update all alerts where the user has not marked them as read yet
        const updatedAlerts = await Alert.updateMany(
            {
                readBy: { $ne: userId }, // Check that the alert has not been marked as read by this user
                // You can also filter further if needed, such as by alert status, type, etc.
            },
            { 
                $push: { readBy: userId }  // Add the user to the 'readBy' array to mark it as read
            }
        );

        if (updatedAlerts.modifiedCount === 0) {
            return res.status(OK).json({
                success: true,
                message: "No alerts to mark as read",
            });
        }

        return res.status(OK).json({
            success: true,
            message: "All alerts marked as read",
            data: updatedAlerts,
        });

    } catch (error) {
        console.error("Error marking alerts as read:", error);
        return res.status(INTERNALERROR).json({
            success: false,
            message: "Something went wrong",
        });
    }
};





