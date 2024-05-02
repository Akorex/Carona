import { Request, Response, NextFunction } from "express";
import {google} from 'googleapis'

import { GOOGLE_CLIENT_ID,
    GOOGLE_OAUTH_SECRET,
    GOOGLE_REDIRECT_URL
 } from "../../config/config";
 import logger from "../../utils/logger";



const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_OAUTH_SECRET,
    GOOGLE_REDIRECT_URL
)


export const googleSignIn = async (req: Request, res: Response, next: NextFunction) => {
    try{
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