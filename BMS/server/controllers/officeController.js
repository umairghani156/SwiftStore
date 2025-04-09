import mongoose from "mongoose";
import { BADREQUEST, CREATED, INTERNALERROR, OK } from "../constants/httpStatus.js";
import { responseMessages } from "../constants/responseMessage.js";
import Office from "../models/Office.js";

export const createOfficeController = async (req, res) => {
    const { officeName, floorNumber, capacity } = req.body;
    try {
        if (!officeName || !floorNumber || !capacity) {
            return res.status(BADREQUEST).json({
                success: false,
                message: responseMessages.MISSING_FIELDS
            })
        };

        const isOfficeExist = await Office.findOne({ officeName: officeName });
        if (isOfficeExist) {
            return res.status(BADREQUEST).json({
                success: false,
                message: responseMessages.ADD_UNSUCCESS_MESSAGES
            })
        };

        const office = new Office({
            officeName,
            floorNumber,
            capacity
        });

        const savedOffice = await office.save();
        if (savedOffice.errors) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Unable to create office"
            })
        };

        return res.status(CREATED).json({
            success: true,
            message: "Office created successfully"
        });


    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
}

export const getAllOfficesController = async (req, res) => {
    try {
        const offices = await Office.find();

        if (!offices) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "No offices found"
            })
        };

        return res.status(CREATED).json({
            success: true,
            message: responseMessages.GET_SUCCESS_MESSAGES,
            data: offices
        })

    } catch (error) {

    }
};


export const updateOfficeController = async (req, res) => {
    const { id } = req.params;
    const { officeName, floorNumber, capacity, isOccupied } = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(id) || !id) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Invalid office id or not found"
            })
        };

        const updateOffice = await Office.findByIdAndUpdate(id, {
            officeName: officeName,
            floorNumber: floorNumber,
            capacity: capacity,
            isOccupied: isOccupied
        },
            {
                set: true
            });

        if(!updateOffice){
            return res.status(BADREQUEST).json({
                success: false,
                message: "Error in updating the Office"
            })
        }

        return res.status(OK).json({
            success: true,
            message: "Office updated successfully"
        })

    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
};

// Get Office Occupancy

export const getOfficeOccupancyController = async (req, res)=>{
    try {
        const officeOccupancy = await Office.aggregate([
            { 
                $group: { 
                    _id: "$isOccupied", 
                    count: { $sum: 1 } 
                }
            },
            {
                $project: {
                    _id: 0, 
                    status: {
                        $cond: { 
                            if: { $eq: ["$_id", true] }, 
                            then: "occupied", 
                            else: "available" 
                        }
                    },
                    count: 1
                }
            },
            {
                $group: {
                    _id: null,
                    occupancy: { 
                        $push: { 
                            k: "$status", 
                            v: "$count" 
                        }
                    }
                }
            },
            {
                $replaceRoot: {
                    newRoot: { 
                        $arrayToObject: "$occupancy" 
                    }
                }
            }
        ]);
        const officeCount = await Office.countDocuments();
        const occcupancyRate = Math.round((officeOccupancy[0].occupied / officeCount) * 100);
       
        if(!officeOccupancy){
            return res.status(BADREQUEST).json({
                success: false,
                message: "No data found"
            })
        };
        return res.status(OK).json({
            success: true,
            message: "Office occupancy fetched successfully",
            data:{
                officeCount: officeCount,
                occcupancyRate: occcupancyRate,
                ...officeOccupancy[0]
            }
        })
        
    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
}