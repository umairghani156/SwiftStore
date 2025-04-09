import {Schema, model} from "mongoose";

const serviceCategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    features:{
        type: [String],
        required: true
    },
    urgencyLevels: {
        type: [String],
        required: true
    },
    responseTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },
    icon:{
        type: String,
        default: ""
    }
},
{
    timestamps: true
});

const ServiceCategory = model('ServiceCategory', serviceCategorySchema);
export default ServiceCategory;
