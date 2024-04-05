import Notifications from "../models/notifications"
import { sendEmail } from "../utils/mailer"
import User from "../models/auth"

export const welcomeNotificationService = async (firstName: string, userId: any) => {
    const title = `Welcome ${firstName}`
    const message = `We're so excited to have you join our carpooling community.
                        On your dashboard, you can see the available routes we offer, 
                        your subscribed routes and their time schedules,
                        you can also pay for your tickets right from here!
                        
                        Keep exploring.`

    await Notifications.create({
        title,
        message,
        user: userId
    })

}

export const welcomeEmailService = async (firstName: string, email: string) => {

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
}

export const changePasswordEmailService = async (email: string) => {

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

}

export const passwordTokenEmailService = async (passwordResetUrl: string, email: string) => {
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
}

export const verifyEmailService = async (verifyEmailToken: string,email: string) =>{
    const emailOptions = {
        from: "akoredeadewole8@gmail.com", // will be changed to Carona's
        to: email,
        subject: "Carona Email Verification",
        body: `<p> Thank you for creating an account with Carona. You're required to 
                    verify your email address with the following token: </p>
                    
                    <h3> ${verifyEmailToken} </h3>

                    <p> If you have any questions, please send an email to Support and 
                    we will be happy to assist you. </p>

                    <p> Best Regards, </p>
                    <p> Akorede from Carona. </p>
                    `
    }

    await sendEmail(emailOptions)
}
