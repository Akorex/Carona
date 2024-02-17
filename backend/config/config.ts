import 'dotenv/config'

export const config = {
    port: process.env.PORT,
    uri: process.env.MONGO_URI,
    apiVersion: 1
}

