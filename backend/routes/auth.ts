import { Router } from "express";
import {
    registerUser,
    loginUser,
    forgotPassword,
    deleteAccount,
    resetPassword,
    changePassword,
    verifyUser,
    loadVerifyUser,
    renderResetForm
} from '../controllers/auth'

import {
    loginUserValidator,
    registerUserValidator
} from '../validators/auth'
import joiMiddleware from "../middlewares/joiMiddleware";
import isLoggedIn from '../middlewares/authentication'
import { googleSignUp, googleSignUpCallback } from "../controllers/google";


const authRouter = Router()
authRouter.post('/register', joiMiddleware(registerUserValidator), registerUser)
authRouter.post('/verifyUser', verifyUser)
authRouter.get('/verifyUser', loadVerifyUser)
authRouter.post('/login', joiMiddleware(loginUserValidator), loginUser)
authRouter.post('/forgot-password', forgotPassword)
authRouter.get('/reset-password', renderResetForm)
authRouter.post('/reset-password', resetPassword)
authRouter.patch('/change-password', isLoggedIn, changePassword)
authRouter.post('/delete-account', isLoggedIn, deleteAccount)
authRouter.get('/google/signin', googleSignUp)
authRouter.get('/google/callback', googleSignUpCallback)

export default authRouter