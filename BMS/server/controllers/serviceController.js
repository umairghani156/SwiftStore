import mongoose from "mongoose";
import { BADREQUEST, CREATED, INTERNALERROR, OK } from "../constants/httpStatus.js";
import { responseMessages } from "../constants/responseMessage.js";
import ServiceCategory from "../models/ServiceCategories.js";

// Add Service 
export const createServiceController = async (req, res) => {
    const {name, description} = req.body
    try {
        if(!name || !description){
            return res.status(BADREQUEST).json({
                success: false,
                message: responseMessages.MISSING_FIELDS
            })
        }
        const isServiceExist = await ServiceCategory.findOne({name: name});
        if(isServiceExist){
            return res.status(BADREQUEST).json({
                success: false,
                message: responseMessages.ADD_UNSUCCESS_MESSAGES
            })
        };
        const service = new ServiceCategory({name: name.trim().replace(/\s+/g, ' '), description});
        const savedService = await service.save();
        if(savedService.errors){
            return res.status(BADREQUEST).json({
                success: false,
                message: "Unable to create service"
            })
        };
        return res.status(CREATED).json({
            success: true,
            message: responseMessages.ADD_SUCCESS_MESSAGES,
            data: savedService
        })
    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        });
    };
};

// Get all Services
export const getAllServicesController = async (req,res) => {
    try {
        const services = await ServiceCategory.find();
        if(!services){
            return res.status(BADREQUEST).json({
                success: false,
                message: "No service found"
            })
        };
        return res.status(OK).json({
            success: true,
            message: responseMessages.GET_SUCCESS_MESSAGES,
            data: services
        })
    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
};

// Get a Service
export const getServiceController = async (res,req) => {};

//Update a Service
export const updateServiceController = async (req, res) => {
    const {id} = req.params;
    try {
        if(!mongoose.Types.ObjectId.isValid(id) || !id){
            return res.status(BADREQUEST).json({
                success: false,
                message: "Id is invalid or required"
            })
        };

        const {name, description, features, urgencyLevels ,responseTime, status} = req.body;
        const updateService = await ServiceCategory.findByIdAndUpdate(id,{name, description,
            features,
            urgencyLevels,
            responseTime,
            status
        },{new: true})
       
        if(!updateService){
            return res.status(BADREQUEST).json({
                success: false,
                message: "Service not found"
            })
        };
        return res.status(OK).json({
            success: true,
            message: "Service updated successfully",
            data: updateService
        })

        
    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
};

// Delete a Service
export const deleteServiceController = async (res,req) => {};