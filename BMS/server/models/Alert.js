import mongoose, { Schema, model } from "mongoose";

const alertSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['Visitor', 'Issue', 'Footfall', 'Emergency', 'Maintenance', 'Security']
    },
    description: { type: String, required: true },
    triggeredAt: { type: Date, default: Date.now },
    severity: {
        type: String,
        required: true,
        enum: ['Low', 'Medium', 'High']
    },
    status: {
        type: String,
        default: 'Unresolved',
        enum: ['Unresolved', 'Resolved']
    },
    relatedEntity: {
        type: Schema.Types.ObjectId,
        ref: 'Visitor'
    },
    location: {
        type: String,
        required: true
    },
    reportedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'ServiceCategory'
    },
    actionTaken: {
        type: String
    },
    notificationSent: {
        type: Boolean,
        default: false
    },
    readBy: [{ 
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
},
{
    timestamps: true
}
);

const Alert = model("Alert", alertSchema);
export default Alert;
