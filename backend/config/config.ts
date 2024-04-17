import 'dotenv/config'

export const config = {
    port: process.env.PORT,
    uri: process.env.MONGO_URI,
    apiVersion: 1
}

export const jwt_secret:any = process.env.JWT_SECRET
export const jwt_lifetime = process.env.JWT_LIFETIME
export const resetTokenExpiresIn = Number(process.env.RESET_EXPIRY) || 0
export const emailAgent = process.env.EMAIL
export const emailPassword = process.env.EMAIL_PASSWORD
export const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY