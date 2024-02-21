import Joi from "joi"
import {
    firstName,
    lastName,
    email, 
    password,
    passwordConfirm,
    gender
} from "./globalSchemas"


export const registerUserValidator = Joi.object({
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    gender
})

export const loginUserValidator = Joi.object({
    email,
    password
})

