import Joi from "joi"

export const firstName = Joi.string().required().min(3).max(20).messages({
    'any.required': "Name is required",
    "string.min": "Name must contain at least 3 characters",
    "string.max": "Name must contain at most 20 characters"
})

export const lastName = Joi.string().required().min(3).max(20).messages({
    'any.required': "Name is required",
    "string.min": "Name must contain at least 3 characters",
    "string.max": "Name must contain at most 20 characters"
})

export const email = Joi.string().required().email().messages({
    "any.requird": "Email address is required",
    "string.email": "Email address is invalid"
})

export const password = Joi.string().required().min(6).messages({
    "string.min": "Password must contain 6 characters",
    "any.required": "Password is required."
})

export const passwordConfirm = Joi.string().required().valid(Joi.ref('password')).messages({
    "any.required": "Password confirm is required",
    "any.only": "Password confirm must match"
})

export const gender = Joi.string().required().valid('Male', 'Female').messages({
    "any.required": "Gender is required.", 
    "string.valid": "You have entered a wrong Gender"
})