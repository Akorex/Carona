import nodemailer from "nodemailer"
import logger from "./logger"
import { emailAgent, emailPassword } from "../config/config"

export interface EmailOptions {
    from: string
    to: string | string[]
    subject: string
    body: string
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: emailAgent,
        pass: emailPassword, 
    },

    tls: {
        rejectUnauthorized: false
    }

})

export async function sendEmail({
    from,
    to,
    subject,
    body
}: EmailOptions){
    try{
        logger.info(`Sending Email from ${from} to ${to}`)
        
        await transporter.sendMail({
            from: `Akorede from Carona <${from}>`,
            to,
            subject: `${subject}`,
            html: body
        })

        logger.info(`Email sent successfully`)

    }catch(error){
        logger.error(error)
    }
}