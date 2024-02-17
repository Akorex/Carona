import Joi from "joi"
import {
    firstName,
    lastName,
    email, 
    password,
    passwordConfirm
} from "./globalSchemas"


export const registerUserValidator = Joi.object({
    firstName,
    lastName,
    email,
    password,
    passwordConfirm
})

export const loginUserValidator = Joi.object({
    email,
    password
})

