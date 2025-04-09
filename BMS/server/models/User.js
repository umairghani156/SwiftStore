import { Schema, model } from "mongoose";

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        trime: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ["Admin", "Office Manager","Security","Tenant"],
        default: "Tenant",
    },
    image:{
        type: String,
        default: "",
    },
    contactNumber: {
        type: String,
        required: false,
    },
    office: {
        type: Schema.Types.ObjectId,
        ref: 'Office',
        required: true
    },
   
},
{
    timestamps: true
});

const User = model('User', userSchema);
export default User;