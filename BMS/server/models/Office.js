import {Schema , model} from "mongoose";

const officeSchema = new Schema({
    officeName: {
        type: String,
        required: true
    },
    floorNumber: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    isOccupied: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
});

const Office = model('Office', officeSchema);
export default Office;