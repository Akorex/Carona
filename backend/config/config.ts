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
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_OAUTH_ID
export const GOOGLE_OAUTH_SECRET = process.env.GOOGLE_OAUTH_SECRET
export const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL
export const BASE_FARE = Number(process.env.BASE_FARE) || 0
export const DISTANCE_RATE = Number(process.env.DISTANCE_RATE) || 0
export const TIME_RATE = Number(process.env.TIME_RATE) || 0
export const TOKEN_EXPIRY = Number(process.env.TOKEN_EXPIRY) * 1000 || 0