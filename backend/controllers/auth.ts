import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import User from '../models/auth'
import { errorResponse, successResponse } from "../utils/responses";
import { StatusCodes } from "http-status-codes";
import { generateHashedValue, generateSignupOTP, AuthResponseData, generateRandomToken, IBasicUser } from "../utils/auth";
import { getBasicUserDetails, createAccessToken, checkValidity } from "../utils/auth";
import {resetTokenExpiresIn} from "../config/config"
import { sendEmail } from "../utils/mailer";
import {config} from '../config/config'


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

        User is shown a separate form to input the OTP. The OTP sent to the user is verified with the database
        and then if correct, user can log in
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

        const emailOptions = {
            from: "akoredeadewole8@gmail.com", // will be changed to Carona's
            to: email,
            subject: "Welcome to Carona!", 
            body: `<h3> Hello ${firstName}, </h3>
            
                    <p> You're officially part of the solution to smoother commutes in
                    Lagos! We're so excited to have you join our carpooling community. Think of us
                    as as your weapon against a chaotic daily commute. We know
                    you'd like a peaceful commute experience while you look forward to the day ahead. </p>
                    
                   <p> With Carona, you get to share the ride with people going your way, enjoy a more 
                   comfortable commute, and maybe even make a few new friends along the way. Plus,
                   you're doing your part to take cars off the road, making Lagos a less chaotic city. 
                   We think that's pretty cool. </p>

                   <p> Let me know if you have any questions.
                    We're always here to make your ride (and your day) a whole lot better. </p>

                    <p> Cheers, </p>
                    <p> Akorede from Carona. </p>
                    `
        }

        await sendEmail(emailOptions)

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

        const email = changedPassword.email

        const emailOptions = {
            from: "akoredeadewole8@gmail.com", // to change to Carona's
            to: email,
            subject: "Password changed",
            body: `<h2> Your password has been changed </h2>
            
                    <p> Your password has been changed, as you asked. </p>
                    
                    <p> If you didn't ask to change your password, we're here to help keep
                    your account secure. Visit our <a href=""> support page </a> for more info.
                    </p>`
        }

        await sendEmail(emailOptions)

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

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {

    try{
        logger.info(`START: Forgot Password Service`)
        const {email} = req.body

        const resetToken = generateRandomToken()
        const passwordResetUrl = `http://localhost:${config.port}/api/v1/auth/reset-password?token=${resetToken}`

        const user = await User.findOneAndUpdate({email}, {
            passwordResetToken: resetToken,
            passwordResetExpires: new Date(Date.now() + resetTokenExpiresIn * 1000).toISOString() //10mins
        })

        if (!user) {
            logger.info(`END: Forgot Password Service`)
            return errorResponse(
                res,
                StatusCodes.NOT_FOUND,
                `This account does not exist. Could not reset password`
            )
        }

        const emailOptions = {
            from: "akoredeadewole8@gmail.com", // will be changed to Carona's,
            to: email,
            subject: "Reset your password",
            body: `<p> Hello, </p>
                    
                    <p> We have reset your password. To sign in to your account, you need to
                    create a new password. 
                    Click <a href = "${passwordResetUrl}"> here </a> to reset your password.

                    Please note that this is only available for ten (10) minutes.
                    </p>`
        }

        await sendEmail(emailOptions)

        successResponse(
            res,
            StatusCodes.OK,
            `Please check your email to reset your password.`,
            null
        )

        logger.info(`END: Forgot Password Service`)

    }catch(error){
        logger.error(`Could not forgot Password`)
        next(error)
    }

}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    // utility for reset password when user forgets their password
    try{
        logger.info(`START: Password Reset Service`)
        const {newPassword} = req.body
        const resetToken = req.query.token

        // search for the user
        const user = await User.findOne({passwordResetToken: resetToken})
        const storedResetToken = user?.passwordResetToken
        const storedTokenExpiry: any = user?.passwordResetExpires


        if (!user) {
            logger.info(`END: Password Reset Service`)
            return errorResponse(
                res,
                StatusCodes.BAD_REQUEST,
                `There is an error with the token. Please try again`
            )

        }

        if (storedResetToken === resetToken && storedTokenExpiry > Date.now()){
            
            // update the password
            const updatePassword = await User.findOneAndUpdate(
                {passwordResetToken: resetToken},
                {password: generateHashedValue(newPassword)}, 
            )

            successResponse(res,
                StatusCodes.OK,
                `Password has been reset successfully. Log in with the new password`,
                null)

            logger.info(`END: Password Reset Service`)
        }else{
            logger.info(`END: Password Reset Service`)
            errorResponse(res,
                StatusCodes.BAD_REQUEST,
                `The password token has expired. Please try again.`
                )
        }


    }catch(error){
        logger.error(`Could not reset password.`)
        next(error)
    }

}



export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {

}