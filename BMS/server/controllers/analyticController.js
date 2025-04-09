import { BADREQUEST, INTERNALERROR, OK } from "../constants/httpStatus.js";
import { responseMessages } from "../constants/responseMessage.js";
import Visitor from "../models/Visitor.js";

// Get All Visitors Stats
export const getAllVisitorsStatsController = async (req, res) => {
    try {
        let today = new Date();

        const startDate =new Date(today.setHours(0, 0, 0, 0));
        const endDate =new Date(today.setHours(23, 59, 59, 999));
        const dailyAnalytics = await Visitor.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);

        if (!dailyAnalytics) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "No visitors found"
            })
        };

       const weeklyAnalytics = await Visitor.aggregate([
        {
            $project: {
                year: { $year: "$createdAt" },
                week: { $isoWeek: "$createdAt" },
              }
        },
        {
            $group: {
                _id: { year: "$year", week: "$week" }, 
                totalVisits: { $sum: 1 } 
              }
        },
        {
            $sort: { "_id.year": -1, "_id.week": -1 }
        }
       ])

        if (!weeklyAnalytics) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "No visitors found"
            })
        };
        
        const monthlyAnalytics = await Visitor.aggregate([
            {
                $project: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                  }
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month" }, 
                    totalVisits: { $sum: 1 } 
                  }
            },
            {
                $sort: {
                    "_id.year": -1,
                    "_id.month": -1
                }
            },
        ])

        if (!monthlyAnalytics) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "No visitors found"
            })
        };

        // Status Pending, Approved, Rejected

        const statusAnalytics = await Visitor.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        //Office wise visitor count

        const officeAnalytics = await Visitor.aggregate([
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
            }
        ]);

        if (!officeAnalytics) {
            return res.status(BADREQUEST).json({
                success: false, 
                message: "No visitors found"
            })
        };
        
       

        return res.status(OK).json({
            success: true,
            message: responseMessages.GET_SUCCESS_MESSAGES,
            data: {
                dailyAnalytics: {...dailyAnalytics[0]},
                weeklyAnalytics: {...weeklyAnalytics[0]},
                monthlyAnalytics: {...monthlyAnalytics[0]},
                statusAnalytics,
                officeAnalytics
            }
        })
        
        
    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
}

// Get All Heatmap
export const getAllHeatmapController = async (req, res) => {
    try {
        const heatmap = await Visitor.aggregate([
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
            }
        ]);
       if(!heatmap){
        return res.status(BADREQUEST).json({
            success: false, 
            message: "No visitors found"
        })
       };

       return res.status(OK).json({
        success: true,
        message: responseMessages.GET_SUCCESS_MESSAGES,
        data: heatmap
       })
        
    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
}