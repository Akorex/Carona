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

    passwordResetToken: getTypeAndDefaultValue(String, null),
    passwordChangedAt: getTypeAndDefaultValue(Date, null),
    passwordResetExpires: getTypeAndDefaultValue(Date, null)
})

const User = mongoose.model('User', userSchema)

export default User