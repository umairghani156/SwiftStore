import {Schema, model} from "mongoose";

const issueSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Resolved"],
        default: "Pending"
    },
    reportedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'ServiceCategory',
            default: ""
    },
    urgency: {
        type: String,
        enum: ["Low", "Medium", "High", "Urgent"],
        default: "Low"
    }
    
},
{
    timestamps: true
}
);

const Issue = model('Issue', issueSchema);
export default Issue;
    