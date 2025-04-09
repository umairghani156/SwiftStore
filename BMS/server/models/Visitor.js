import mongoose, { Schema, model } from "mongoose";

const visitorSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
     },
    cnicNumber: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true 
    },
    office: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Office',
        required: true
    },
    purpose: {
        type: String,
        required: true
    },
    duration:{
        type: String,
        required: true
    },
    check_in: {
         type: Date,
         default: ""
    },
    check_out: {
        type: Date,
        default: ""
    },
    status:{
        type: String,
        enum: ['Pending', 'Approved',"Rejected"],
        default: 'Pending'
    },
    token: {
        type: String,
        unique: true
    },
    qrCode: {
        type: String,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
   
}, {
    timestamps: true
});

const Visitor = model('Visitor', visitorSchema);
export default Visitor;

// status: {
//     type: String,
//     enum: ['Pending', 'CheckedIn', 'CheckedOut'],
//     default: 'Pending'
// },