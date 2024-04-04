import Notifications from "../models/notifications";
import logger from "../utils/logger";
import connectDB from "../config/db";
import {config} from "../config/config"
import 'dotenv/config'

const mongoUri = config.uri

console.log(mongoUri)

const seedNotification = async () => {

    try{
        const feed = {
            title: 'Holla',
            message: `
            Welcome to a mordern way of Commuting. 
            With Carona, you get to share the ride with people going your way, enjoy a more 
            comfortable commute, and maybe even make a few new friends along the way.`,
            user: '660eab83b33e0419fde4e316'
        }

        await connectDB(mongoUri)

        const newNotification = await Notifications.create({
            title: feed.title,
            message: feed.message,
            user: feed.user
        })
        
        if(!newNotification){
            console.log(`Seeding failed`)
        }

        console.log(`Seeding successfully done`)

    }catch(error){
        logger.error(`Could not seed notification database ${error}`)
    }

}

seedNotification()