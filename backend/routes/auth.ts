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
    renderResetForm,
    getUserDetails
} from '../controllers/auth'

import {
    loginUserValidator,
    registerUserValidator
} from '../validators/auth'
import joiMiddleware from "../middlewares/joiMiddleware";
import {isLoggedIn} from '../middlewares/authentication'
import { isAdmin } from "../middlewares/authentication";
import { googleSignUp, googleSignUpCallback } from "../controllers/google";
import { approveCaronaShareUser, registerCaronaShareUser, registerCaronaUserWithoutCar } from "../controllers/caronashare";


const authRouter = Router()
authRouter.post('/register', joiMiddleware(registerUserValidator), registerUser)
authRouter.get('/getUser', isLoggedIn, getUserDetails)
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

// CARONA SHARE
authRouter.post('/caronashare/registerToShare', isLoggedIn, registerCaronaShareUser)
authRouter.post('/caronashare/registerToRide', isLoggedIn, registerCaronaUserWithoutCar)
authRouter.post('/caronashare/:userId/approve', isAdmin, approveCaronaShareUser)

export default authRouter