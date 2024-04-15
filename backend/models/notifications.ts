import mongoose, { Schema } from "mongoose";

const NotificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    isReadFlag: {
        type: Boolean,
        default: false
    }



}, {timestamps: true})


const Notifications = mongoose.model('Notifications', NotificationSchema)
export default Notifications