import { Router } from "express";
import {
    registerUser,
    loginUser,
    forgotPassword,
    deleteAccount,
    resetPassword,
    changePassword
} from '../controllers/auth'

import {
    loginUserValidator,
    registerUserValidator
} from '../validators/auth'
import joiMiddleware from "../middlewares/joiMiddleware";
import isLoggedIn from '../middlewares/authentication'


const authRouter = Router()
authRouter.post('/register', joiMiddleware(registerUserValidator), registerUser)
authRouter.post('/login', joiMiddleware(loginUserValidator), loginUser)
authRouter.post('/forgot-password', forgotPassword)
authRouter.post('reset-password', resetPassword)
authRouter.post('/delete-account', deleteAccount)
authRouter.patch('/change-password', isLoggedIn, changePassword)


export default authRouter