import 'dotenv/config'

export const config = {
    port: process.env.PORT,
    uri: process.env.MONGO_URI,
    apiVersion: 1
}

export const jwt_secret:any = process.env.JWT_SECRET
export const jwt_lifetime = process.env.JWT_LIFETIME