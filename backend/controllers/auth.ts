import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import User from '../models/auth'
import { errorResponse, successResponse } from "../utils/responses";
import { StatusCodes } from "http-status-codes";
import { generateHashedValue, generateSignupOTP, AuthResponseData } from "../utils/auth";
import { getBasicUserDetails, createAccessToken } from "../utils/auth";

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

        To do: send the generated OTP to the user's phone no, for verification before 
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

}

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {

}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {

}

export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {

}

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    
}