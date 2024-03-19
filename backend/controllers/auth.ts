import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import User from '../models/auth'
import { errorResponse, successResponse } from "../utils/responses";
import { StatusCodes } from "http-status-codes";
import { generateHashedValue, generateSignupOTP, AuthResponseData, generateRandomToken } from "../utils/auth";
import { getBasicUserDetails, createAccessToken, checkValidity } from "../utils/auth";
import {resetTokenExpiresIn} from "../config/config"

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
        logger.info(`START: Create User Service`)

        const {
            firstName,
            lastName,
            email,
            password,
            gender,
            phoneNumber
        } = req.body

        const existingUser = await User.findOne({email})

        if (existingUser){
            logger.info(`END: Create User Service`)
            return errorResponse(
                res,
                StatusCodes.BAD_REQUEST,
                `User already exists. Log in instead.`
            )
        }

        
        /*....

        const otp = generateSignupOTP()

        To do: send the generated OTP to the user's phone no & email for verification before 
        successful registeration continues.   
        */

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: generateHashedValue(password),
            gender,
            phoneNumber
        })

        successResponse<AuthResponseData>(
            res,
            StatusCodes.CREATED,
            `Successfully created account`,
            {user: getBasicUserDetails(newUser), jwt: createAccessToken(newUser._id)}
        )
        logger.info(`END: Create User Service`)
    
    }catch(error){
        logger.error(`Could not create account.`)
        next(error)
    }



}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
        logger.info(`START: Login User Service`)
        const {email, password} = req.body

        if (!email || !password){
            errorResponse(
                res,
                StatusCodes.BAD_REQUEST,
                `Please provide your email and password`
            )
        }

        const user = await User.findOne({email})

        if (!user){
            logger.info(`END: Login User Service`)
            return errorResponse(
                res,
                StatusCodes.NOT_FOUND,
                `This accound does not exist. Please signup instead`
            )
        }

        if (!checkValidity(password, user.password)){
            logger.info(`END: Login User Service`)
            return errorResponse(
                res,
                StatusCodes.BAD_REQUEST,
                `You have entered a wrong email/password`
            )
        }

        successResponse<AuthResponseData>(
            res,
            StatusCodes.OK,
            `Successfully logged in`,
            {user: getBasicUserDetails(user), jwt: createAccessToken(user._id)}
        )
        logger.info(`END: Login User Service`)

    }catch(error){
        logger.error(`Could not log in`)
        next(error)
    }

}

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    // when user has forgotten their password, forgotPassword serves as utility
    // to generate and send a token to their email/phone

    try{
        const {email} = req.body

        // generate the token

        const resetToken = generateRandomToken()

        const user = await User.findOneAndUpdate({email}, {
            passwordResetToken: resetToken,
            passwordResetExpires: new Date(Date.now() + resetTokenExpiresIn * 1000).toISOString() //10mins
        })

    }catch(error){
        logger.error(`Could not forgotPassword`)
        next(error)
    }

}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    // utility for reset password when user 

}

export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {

}

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try{

        logger.info(`START: Change Password Service`)
        const {
            currentPassword,
            newPassword
        } = req.body

        let user_id = req.user.userId
        const loggedinUser = await User.findById({_id: user_id})

        if (! loggedinUser){
            logger.info(`END: Change Password Service`)
            return errorResponse(
                res,
                StatusCodes.BAD_REQUEST,
                `Please sign-in to change password`
            )
        }

        if (! checkValidity(currentPassword, loggedinUser.password)){
            logger.info(`END: Change Password Service`)
            return errorResponse(
                res,
                StatusCodes.BAD_REQUEST,
                `Please enter a correct password`
            )
        }

        const changedPassword = await User.findByIdAndUpdate({_id: user_id}, {
            password: generateHashedValue(newPassword)}, {new: true, runValidators: true})

        if (!changedPassword){
            logger.info(`END: Change Password Service`)
            return errorResponse(
                res,
                StatusCodes.NOT_FOUND,
                `Something went wrong`
            )        
        }

        successResponse(
            res,
            StatusCodes.OK,
            `Password changed successfully`,
            null
        )
        logger.info(`END: Change Password Service`)

    }catch(error){
        logger.error(`Could not change password`)
        next(error)
    }
    
}