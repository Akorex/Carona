import mongoose from "mongoose"
import logger from "../utils/logger"

const connectDB = (url: any) => {
    return mongoose
    .connect(url)
    .then(() => logger.info(`Connected to the database successfully.`))
    .catch((error) => logger.error(`Unable to connect to the database: ${error}`))
}

export default connectDB