import { Router } from "express";
import {
    registerUser,
    loginUser,
    forgotPassword,
    deleteAccount,
    resetPassword
} from '../controllers/auth'

import {
    loginUserValidator,
    registerUserValidator
} from '../validators/auth'
import joiMiddleware from "../middlewares/joiMiddleware";


const authRouter = Router()
authRouter.post('/register', joiMiddleware(registerUserValidator), registerUser)
authRouter.post('/login', joiMiddleware(loginUserValidator), loginUser)
authRouter.post('/forgot-password', forgotPassword)
authRouter.post('/delete-account', deleteAccount)


export default authRouter