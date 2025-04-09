import mongoose, { mongo } from "mongoose"
import { BADREQUEST, CREATED, INTERNALERROR, OK } from "../constants/httpStatus.js"
import { responseMessages } from "../constants/responseMessage.js"
import Office from "../models/Office.js"
import Visitor from "../models/Visitor.js";
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

// Register a Visitor
export const registerVisitorController = async (req, res) => {
    const {user} = req;
    const { name, cnicNumber, contact, office, duration, purpose, check_in, check_out, status } = req.body
    try {

        if (!name || !contact || !office || !duration || !cnicNumber || !purpose) {
            return res.status(BADREQUEST).json({
                success: false,
                message: responseMessages.MISSING_FIELDS
            })
        };
        if (cnicNumber.length < 13 || cnicNumber.length > 13) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Invalid CNIC number"
            })
        }

        const isOfficeExist = await Office.findById({ _id: new mongoose.Types.ObjectId(office) });
        if (!isOfficeExist) {
            return res.status(BADREQUEST).json({
                success: false,
                message: responseMessages.ADD_UNSUCCESS_MESSAGES
            })
        };

        const updateOffice = await Office.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(office) }, { isOccupied: true }, { new: true });
        if (!updateOffice) {
            return res.status(BADREQUEST).json({
                success: false,
                message: responseMessages.ADD_UNSUCCESS_MESSAGES
            })
        };


        const isVisitorExist = await Visitor.findOne({ cnicNumber: cnicNumber });
        if (isVisitorExist) {
            return res.status(BADREQUEST).json({
                success: false,
                message: responseMessages.ADD_UNSUCCESS_MESSAGES
            })
        };

        const visitor = new Visitor({ name: name.trim().replace(/\s+/g, ' '), cnicNumber, contact, office, duration, purpose, check_in, check_out, status: status, token: uuidv4().slice(0, 8),
            userId: new mongoose.Types.ObjectId(user._id)
         });
        const qrCodeURL = await QRCode.toDataURL(visitor.token);
        visitor.qrCode = qrCodeURL;

        const savedVisitor = await visitor.save();
        if (savedVisitor.errors) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Unable to create visitor"
            })
        } else {
            return res.status(CREATED).json({
                success: true,
                message: responseMessages.ADD_SUCCESS_MESSAGES,
                data: savedVisitor
            });
        }



    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
}


// List all Visitors
export const listsVisitorController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalVisitors = await Visitor.countDocuments();
        const totalPages = Math.ceil(totalVisitors / limit);

        const visitors = await Visitor.find()
            .populate('office')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        if (!visitors) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "No visitors found"
            })
        };

        return res.status(OK).json({
            success: true,
            message: responseMessages.GET_SUCCESS_MESSAGES,
            data: {
                visitors,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalVisitors,
                    limit
                }
            }
        })

    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
}

// Get a Visitor
export const getVisitorController = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id) || !id) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Invalid visitor id or not found"
            })
        };
        const visitor = await Visitor.findById(id).populate('office');

        if (!visitor) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Visitor not found"
            })
        };

        return res.status(OK).json({
            success: true,
            message: responseMessages.GET_SUCCESS_MESSAGES,
            data: visitor
        })
    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
}

// Update a Visitor
export const updateVisitorController = async (req, res) => {
    const { id } = req.params;
    const { name, cnicNumber, contact, office, duration, purpose, check_in, check_out, status } = req.body;
    try {

        if (!mongoose.Types.ObjectId.isValid(id) || !id) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Invalid visitor id or not found"
            })
        };
        const visitor = await Visitor.findById(id);
        if (!visitor) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Visitor not found"
            });
        };

        const updateVisitor = await Visitor.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, {
            name: name?.trim()?.replace(/\s+/g, ' '),
            cnicNumber: cnicNumber,
            contact: contact,
            office: office,
            duration: duration,
            status: status,
            purpose: purpose,
            check_in: check_in,
            check_out: check_out,

        }, { new: true });
        if (!updateVisitor) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Unable to update visitor"
            })
        };
        return res.status(OK).json({
            success: true,
            message: "Visitor updated successfully",
            data: updateVisitor
        });


    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
}

// Delete a Visitor
export const deleteVisitorController = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id) || !id) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Invalid visitor id or not found"
            })
        };
        const visitor = await Visitor.findByIdAndDelete(id);

        if (!visitor) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Visitor not found"
            })
        };

        return res.status(OK).json({
            success: true,
            message: "Visitor deleted successfully",
            data: visitor
        })

    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
};


// Total Visitors Count

export const totalVisitorsCountController = async (req, res) => {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    try {
        const visitors = await Visitor.aggregate([
            { $group: { _id: null, count: { $sum: 1 } } },
            { $project: { _id: 0, count: 1 } }
        ]);
        if (!visitors) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "No visitors found"
            })
        };



        const checkInVisitors = await Visitor.aggregate([
            { $match: { check_in: { $ne: null } } },
            { $group: { _id: null, count: { $sum: 1 } } },
            { $project: { _id: 0, count: 1 } }
        ]);
        if (!checkInVisitors) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "No visitors found"
            })
        };
        const checkOutVisitors = await Visitor.aggregate([
            { $match: { check_out: { $ne: null } } },
            { $group: { _id: null, count: { $sum: 1 } } },
            { $project: { _id: 0, count: 1 } }
        ]);
        if (!checkOutVisitors) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "No visitors found"
            })
        };
        const todaysVisitors = await Visitor.aggregate([
            {
                $match: {
                    check_in: {
                        $gte: startDate,
                        $lt: endDate
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    count: 1
                }
            }
        ]);
        if (!todaysVisitors) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "No visitors found"
            })
        };

        // Visitors By Office
        const visitorsByOffice = await Visitor.aggregate([
            {
                $lookup: {
                    from: "offices",  
                    localField: "office",  
                    foreignField: "_id",  
                    as: "officeDetails" 
                }
            },
            {
                $unwind: "$officeDetails"  
            },
            {
                $group: {
                    _id: "$office",  
                    count: { $sum: 1 }, 
                    officeName: { $first: "$officeDetails.officeName" }  
                }
            },
            {
                $project: {
                    _id: 0,  
                    officeId: "$_id", 
                    officeName: 1,  
                    count: 1  
                }
            }
        ]);

        if (!visitorsByOffice) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "No visitors found"
            })
        };

        return res.status(OK).json({
            success: true,
            message: responseMessages.GET_SUCCESS_MESSAGES,
            data: {
                todaysVisitors: todaysVisitors[0]?.count ? todaysVisitors[0].count : 0,
                totalVisitors: visitors[0].count,
                checkInVisitors: checkInVisitors[0].count,
                checkOutVisitors: checkOutVisitors[0].count,
                visitorsByOffice

            }
        })
    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
};


export const checkInController = async (req, res) => {
    const { id } = req.params;
    const { check_in } = req.body;
    try {
        if (!id) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Invalid visitor token or not found"
            })
        };
        const visitor = await Visitor.findOneAndUpdate({ token: id }, { check_in: check_in }, { new: true });
        if (!visitor) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Unable to check in visitor"
            })
        };
        return res.status(OK).json({
            success: true,
            message: "Visitor checked in successfully",
            data: visitor
        });
    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
};


// Checkout a Visitor

export const checkOutController = async (req, res) => {
    const { id } = req.params;
    const { check_out } = req.body;
    try {
        if (!id) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Invalid visitor token or not found"
            })
        };
        const visitor = await Visitor.findOneAndUpdate({ token: id }, { check_out: check_out }, { new: true });
        if (!visitor) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Unable to check out visitor"
            })
        };
        return res.status(OK).json({
            success: true,
            message: "Visitor checked out successfully",
            data: visitor
        });
    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
};


// Hourly Visitor Flow

export const hourlyVisitorFlowController = async (req, res) => {
    try {
        
        const totalVisitors = await Visitor.countDocuments();

       
        const visitors = await Visitor.find().populate('office');
        const visitorsByOffice = {};

        visitors.forEach(visitor => {
            const officeName = visitor.office.officeName;
            if (visitorsByOffice[officeName]) {
                visitorsByOffice[officeName]++;
            } else {
                visitorsByOffice[officeName] = 1;
            }
        });

        // Step 3: Get hourly visitors
        const hourlyVisitors = Array(24).fill(0);

        visitors.forEach(visitor => {
            const checkInHour = new Date(visitor.check_in).getHours();
            hourlyVisitors[checkInHour]++;
        });

        // Step 1: Get the current date
        const currentDate = new Date();

        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Sets to last Sunday

        const weeklyVisitors = Array(7).fill(0);

        // Step 4: Filter the visitors based on the last 7 days
        visitors.forEach(visitor => {
            const visitorDate = new Date(visitor.check_in);


            if (visitorDate >= startOfWeek) {
                const checkInHour = visitorDate.getDay();
                weeklyVisitors[checkInHour]++;
            }
        });
        const weeklyDensity = weeklyVisitors.map(visitorCount => {
            return totalVisitors > 0 ? (visitorCount / totalVisitors) * 100 : 0;
        });



        const monthlyVisitors = Array(31).fill(0);  

        visitors.forEach(visitor => {
            const checkInDate = new Date(visitor.check_in);
            const checkInDay = checkInDate.getDate();  

           
            monthlyVisitors[checkInDay - 1] += 1;  
        });

        const monthlyDensity = monthlyVisitors.map(visitorCount => {
            return totalVisitors > 0 ? (visitorCount / totalVisitors) * 100 : 0;
        });
        

       const visitorByOfficeDataArray = Object.entries(visitorsByOffice).map(([officeName, count]) => ({
           officeName,
           count
       }));

       
        const visitorStats = {
            totalVisitors,
            visitorsByOffice,
            hourlyVisitors,
            weeklyVisitors,
            weeklyDensity,
            monthlyVisitors,
            monthlyDensity,
            visitorByOfficeDataArray
        };

        // Step 4: Send the response back to the client
        res.status(200).json({
            success: true,
            message: "Visitor stats fetched successfully",
            data: visitorStats
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// Visitor Trends and Density
export const getVisitorTrendsController = async (req, res) => {
    try {
        // Get total visitors
        const totalVisitors = await Visitor.countDocuments();

        // Get visitors by office (manual grouping)
        const visitors = await Visitor.find().populate('office');
        const visitorsByOffice = {};

        visitors.forEach(visitor => {
            const officeName = visitor.office.officeName;
            if (visitorsByOffice[officeName]) {
                visitorsByOffice[officeName]++;
            } else {
                visitorsByOffice[officeName] = 1;
            }
        });

        // Get hourly visitors
        const hourlyVisitors = Array(24).fill(0);

        visitors.forEach(visitor => {
            const checkInHour = new Date(visitor.check_in).getHours();
            hourlyVisitors[checkInHour]++;
        });

        // Get the current date
        const currentDate = new Date();

        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Sets to last Sunday

        const weeklyVisitors = Array(7).fill(0);

        // Filter the visitors based on the last 7 days
        visitors.forEach(visitor => {
            const visitorDate = new Date(visitor.check_in);


            if (visitorDate >= startOfWeek) {
                const checkInHour = visitorDate.getDay();
                weeklyVisitors[checkInHour]++;
            }
        });


       // Calculate the weekly density based on the visitors
        const weeklyDensity = weeklyVisitors.map(visitorCount => {
            return totalVisitors > 0 ? (visitorCount / totalVisitors) * 100 : 0;
        });

        const monthlyVisitors = Array(30).fill(0);

        visitors.forEach(visitor => {
            const checkInDate = new Date(visitor.check_in);
            const checkInMonth = checkInDate.getMonth();
            const checkInDay = checkInDate.getDate();
            monthlyVisitors[checkInMonth] += 1;
        });

        const monthlyDensity = monthlyVisitors.map(visitorCount => {
            return totalVisitors > 0 ? (visitorCount / totalVisitors) * 100 : 0; // Percentage
        });


        // Construct the final visitor stats object
        const visitorStats = {
            totalVisitors,
            visitorsByOffice,
            hourlyVisitors,
            weeklyVisitors,
            weeklyDensity,
            monthlyDensity
        };

        // Step 4: Send the response back to the client
        res.status(200).json({
            success: true,
            message: "Visitor stats fetched successfully",
            data: visitorStats
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
};


// Check in a Visitor

export const checkInVisitorController = async (req, res) => {
    const { tokenId } = req.query;
    const { check_in } = req.body;
    try {
        if (!tokenId) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Token id is not found"
            })
        }

        if (!check_in) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Check in date is not found"
            })
        }

        const visitor = await Visitor.findOneAndUpdate({ token: tokenId }, { check_in }, { new: true });

        if (!visitor) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Visitor not found"
            })
        };

        return res.status(OK).json({
            success: true,
            message: "Visitor checked in successfully"
        })

    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
};



// Checkout a Visitor
export const checkOutVisitorController = async (req, res) => {
    const { tokenId } = req.query;
    const { check_out } = req.body;
    try {
        if (!tokenId) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Token id is not found"
            })
        };

        if (!check_out) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Check out date is not found"
            })
        };
        const visitor = await Visitor.findOneAndUpdate({ token: tokenId }, { check_out }, { new: true });

        if (!visitor) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Visitor not found"
            })
        };
        return res.status(200).json({
            success: false,
            message: "Checkout successfully"
        });

    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
};

// Get a Visitor's Appoinments

export const getVisitorAppointmentsController = async (req, res) => {
    const { _id } = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    try {
        if (!mongoose.Types.ObjectId.isValid(_id) || !_id) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Id is invalid or required"
            })
        };
        const totalAppointments = await Visitor.countDocuments({ userId: new mongoose.Types.ObjectId(_id) });
        const totalPages = Math.ceil(totalAppointments / limit);
       const visitors = await Visitor.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(_id)
            }
        },
        {
            $lookup: {
                from: 'offices',
                localField: 'office',
                foreignField: '_id',
                as: 'office'
            }
        },
        {
            $unwind: {
                path: '$office',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: {
                path: '$user',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: { 
                _id: 1,
                name: 1,
                contact: 1,
                cnicNumber: 1,
                token: 1,
                check_in: 1,
                check_out: 1,
                purpose: 1,
                duration: 1,
                status: 1,
                office: {
                    _id: 1,
                    officeName: 1
                },
                user: {
                    _id: 1,
                    username: 1
                },
                createdAt: 1

            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $skip: (page - 1) * limit
        },
        {
            $limit: limit
        }
       
       ])
        return res.status(OK).json({
            success: true,
            message: "Visitor appointments fetched successfully",
            data: {visitors,
                pagination: {
                    currentPage: page,
                    totalAppointments,
                    totalPages,
                    limit
                }
            },
            
           
        });
    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }   
}