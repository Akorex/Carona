import { Request, Response, NextFunction } from "express";
import {google} from 'googleapis'

import { GOOGLE_CLIENT_ID,
    GOOGLE_OAUTH_SECRET,
    GOOGLE_REDIRECT_URL
 } from "../config/config";
 import logger from "../utils/logger";
import { createAccessToken, generateHashedValue, generateOTP, getBasicUserDetails, getGoogleUserProfile } from "../utils/auth";
import User from "../models/auth";
import {welcomeEmailService, welcomeNotificationService} from '../services/auth'
import { AuthResponseData } from "../utils/auth";
import {successResponse} from '../utils/responses'
import {StatusCodes} from 'http-status-codes'



const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_OAUTH_SECRET,
    GOOGLE_REDIRECT_URL
)


export const googleSignUp = async (req: Request, res: Response, next: NextFunction) => {
    try{

        logger.info(`START: Sign-Up with Google Service`)
        const scopes = ['https://www.googleapis.com/auth/userinfo.email', 
        'https://www.googleapis.com/auth/userinfo.profile']

        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes
        })

        res.status(200).send({url})

        //res.redirect(url)

    }catch(error){
        logger.error(`Error signing up with google`)
        next(error)
    }

}

export const googleSignUpCallback = async (req: Request, res: Response, next: NextFunction) => {
    try{

        const authCode = (req.query?.code as string) ?? ''
        google.options({auth: oauth2Client})

        const {tokens} = await oauth2Client.getToken(authCode)
        oauth2Client.setCredentials(tokens)

        if (typeof tokens.access_token == 'string'){
            const userProfile = await getGoogleUserProfile(tokens.access_token)


            const existingUser = await User.findOne({email: userProfile.email})

            if (existingUser){
                logger.info(`END: Sign Up with Google Service`)
                return 
            }

            const otp = generateOTP()
            const user = await User.create({
                firstName: userProfile.firstName,
                lastName: userProfile.lastName,
                email: userProfile.email,
                password: generateHashedValue(otp), // random not necessary
            })

            await welcomeEmailService(user.firstName, user.email)
            await welcomeNotificationService(user.firstName, user._id)
            logger.info(`END: Sign Up with Google Service`)

            successResponse<AuthResponseData>(res,
                StatusCodes.CREATED,
                `Sucessfully created account`,
                {user: getBasicUserDetails(user), jwt: createAccessToken(user._id)}
            )


        }


    }catch(error){
        logger.error(`Error signing up with google`)
        next(error)
    }
}

