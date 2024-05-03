import mongoose from "mongoose";
import {getTypeAndDefaultValue} from '../utils/auth'

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },

    lastName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },

    password: {
        type: String,
        required: true,
        minlength: [6, 'Your password should be exceed 6 characters.']
    }, 

    email: {
        type: String,
        required: [true, 'Email address must be provided.'],
        unique: true

    },

    phoneNumber: {
        ...getTypeAndDefaultValue(Number, null),
        unique: true
    },


    gender: {
        type: String,
        enum: ['Male', 'Female']
    },

    isVerified:{
        type: Boolean,
        default: false
    },

    verificationToken: {
        type: Number
    },

    profileImageUrl: getTypeAndDefaultValue(String, null),
    accountCreateToken: getTypeAndDefaultValue(String, null),
    accountCreateTokenExpires: getTypeAndDefaultValue(Date, null),
    passwordResetToken: getTypeAndDefaultValue(String, null),
    passwordChangedAt: getTypeAndDefaultValue(Date, null),
    passwordResetExpires: getTypeAndDefaultValue(Date, null)
}, {timestamps: true})

const User = mongoose.model('User', userSchema)

export default User