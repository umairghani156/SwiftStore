import mongoose from "mongoose";
import { BADREQUEST, CREATED, INTERNALERROR, OK } from "../constants/httpStatus.js";
import { responseMessages } from "../constants/responseMessage.js";
import Issue from "../models/Issue.js";

// Create Issue
export const createIssueController = async (req, res) => {
    const { title, description, status, assignedTo, urgency } = req.body;


    try {
        if (!title || !description) {
            return res.status(BADREQUEST).json({
                success: false,
                message: responseMessages.MISSING_FIELDS
            })
        };
        let reportedBy = req.user._id

        if (!mongoose.Types.ObjectId.isValid(reportedBy) || !reportedBy) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Invalid user id or not found"
            })
        };

        const issue = new Issue({
            title,
            description,
            status,
            reportedBy,
            assignedTo,
            urgency: urgency
        });

        const savedIssue = await issue.save();

        if (!savedIssue) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Issue not created"
            })
        };

        return res.status(CREATED).json({
            success: true,
            message: responseMessages.ADD_SUCCESS_MESSAGES,
            data: savedIssue
        })



    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
};

// Get All Issue
export const getAllIssueController = async (req, res) => {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        if (!mongoose.Types.ObjectId.isValid(userId) || !userId) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "User is unauthorized"
            })
        };

        const totalIssues = await Issue.countDocuments();
        const totalPages = Math.ceil(totalIssues / limit);

        const issues = await Issue.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'reportedBy',
                    foreignField: '_id',
                    as: 'reportedBy'
                }
            },
            {
                $lookup: {
                    from: 'servicecategories',
                    localField: 'assignedTo',
                    foreignField: '_id',
                    as: 'assignedTo'
                }
            },
            {
                $unwind: { path: '$reportedBy', preserveNullAndEmptyArrays: true }
            },
            {
                $unwind: { path: '$assignedTo', preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    status: 1,
                    'reportedBy._id': 1,
                    'reportedBy.username': 1,
                    'reportedBy.email': 1,
                    'reportedBy.contactNumber': 1,
                    'assignedTo._id': 1,
                    'assignedTo.name': 1,
                    'assignedTo.category': 1,
                    'assignedTo.description': 1,
                    'assignedTo.image': 1,
                    'assignedTo.createdAt': 1,
                    'assignedTo.updatedAt': 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ])

        return res.status(OK).json({
            success: true,
            message: responseMessages.GET_SUCCESS_MESSAGES,
            data: {
                issues,
                pagination: {
                    currentPage: page,
                    totalIssues,
                    totalPages,
                    limit
                }
            }
        });

    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
};


// Get an Issue

export const getIssueController = async (req, res) => {
    const { id } = req.params;
   
    try {
        if (!mongoose.Types.ObjectId.isValid(id) || !id) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Invalid issue id or not found"
            })
        };

        const issue = await Issue.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'reportedBy',
                    foreignField: '_id',
                    as: 'reportedBy'
                }
            },
            {
                $lookup: {
                    from: 'servicecategories',
                    localField: 'assignedTo',
                    foreignField: '_id',
                    as: 'assignedTo'
                }
            },
            {
                $unwind: { path: '$reportedBy', preserveNullAndEmptyArrays: true }
            },
            {
                $unwind: { path: '$assignedTo', preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    status: 1,
                    'reportedBy._id': 1,
                    'reportedBy.username': 1,
                    'reportedBy.email': 1,
                    'reportedBy.contactNumber': 1,
                    'reportedBy.office': 1,
                    'reportedBy.role': 1,
                    'assignedTo._id': 1,
                    'assignedTo.name': 1
                }
            },
            
        ]);
        if (!issue) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Issue not found"
            })
        };

        return res.status(OK).json({
            success: true,
            message: responseMessages.GET_SUCCESS_MESSAGES,
            data: issue
        });




    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
}
// Update Issue
export const updateIssueController = async (req, res) => {
    const { id } = req.params
    const { title, description, status, assignedTo,urgency } = req.body
    try {
        if (!status || !assignedTo) {
            return res.status(BADREQUEST).json({
                success: false,
                message: responseMessages.MISSING_FIELDS
            })
        };
        if (!mongoose.Types.ObjectId.isValid(id) || !id) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Invalid issue id or not found"
            })
        };

        if (!mongoose.Types.ObjectId.isValid(assignedTo) || !assignedTo) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Service category Id is invalid"
            })
        };


        const issue = await Issue.findByIdAndUpdate(id, { title, description, status, assignedTo ,urgency}, { new: true }).populate('reportedBy').populate('assignedTo');
        if (!issue) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Issue not found"
            })
        };

        return res.status(OK).json({
            success: true,
            message: responseMessages.UPDATE_SUCCESS_MESSAGES,
            data: issue
        });


    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
};

// Get Issues Status Count
export const getIssuesStatusController = async (req, res)=>{
    try {
        const issues = await Issue.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    status: '$_id',
                    count: 1
                }
            }
        ]);

        if (!issues) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Issues not found"
            })
        };
        const totalIssues = await Issue.countDocuments();
        return res.status(OK).json({
            success: true,
            message: responseMessages.GET_SUCCESS_MESSAGES,
            data: {pending: issues[0].count, inProgress: issues[1].count, completed: issues[2].count,
                totalIssues: totalIssues
            }
        });
    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
};


export const getUsersIssuesController = async (req, res) =>{
    const id = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    try {
        if(!mongoose.Types.ObjectId.isValid(id) || !id){
            return res.status(BADREQUEST).json({
                success: false,
                message: "Invalid user id or not found"
            })
        };

        const totalIssues = await Issue.countDocuments({reportedBy: new mongoose.Types.ObjectId(id)});
        const totalPage = Math.ceil(totalIssues / limit);
       
       

        const issues = await Issue.aggregate([
            { $match: { reportedBy: new mongoose.Types.ObjectId(id) } },
            {
                $lookup: {
                    from: 'servicecategories',
                    localField: 'assignedTo',
                    foreignField: '_id',
                    as: 'assignedTo'
                }
            },
            {
                $unwind: { path: '$assignedTo', preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    status: 1,
                    urgency: 1,
                    'assignedTo._id': 1,
                    'assignedTo.name': 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ]);
        if (!issues) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Issues not found"
            })
        };

        const statusCount = await Issue.aggregate([
            { $match: { reportedBy: new mongoose.Types.ObjectId(id) } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    status: '$_id',
                    count: 1
                }
            }
        ]);
        const statusCountObject = statusCount.reduce((acc, item) => {
            acc[item.status] = item.count;
            return acc;
        }, {});

        return res.status(OK).json({
            success: true,
            message: responseMessages.GET_SUCCESS_MESSAGES,
            data: {
                issues: issues,
                pagination:{
                    currentPage: page,
                    totalPage: totalPage,
                    totalIssues: totalIssues,
                    limit,
                    statusCount:statusCountObject
                }

            }
        });
        
    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
};


export const getAllIssuesByServiceController = async (req, res)=>{
    const {name} = req.params
    const regex = new RegExp(name, 'i');
    try {
       const issues = await Issue.aggregate([
           {
            $match: {'title': regex}
           },
           {
            $lookup: {
                from: 'servicecategories',
                localField: 'assignedTo',
                foreignField: '_id',
                as: 'assignedTo'
            }
           },
           {
            $unwind: { path: '$assignedTo', preserveNullAndEmptyArrays: true }
           },
           {
            $lookup: {
                from: 'users',
                localField: 'reportedBy',
                foreignField: '_id',
                as: 'reportedBy'
            }
           },
           {
            $unwind: { path: '$reportedBy', preserveNullAndEmptyArrays: true }
           },
           {
            $project: {
                title: 1,
                description: 1,
                status: 1,
                urgency: 1,
                'assignedTo._id': 1,
                'assignedTo.name': 1,
                'reportedBy._id': 1,
                'reportedBy.username': 1,
                createdAt: 1,
                updatedAt: 1
            }
           },
           {
            $sort: {
                createdAt: -1
            }
           }
       ])
        if (!issues || issues.length === 0) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Issues not found"
            })
        };

        return res.status(OK).json({
            success: true,
            message: responseMessages.GET_SUCCESS_MESSAGES,
            data: issues
        });
    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
}