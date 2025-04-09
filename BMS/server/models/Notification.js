import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    sentTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
},
{
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
        