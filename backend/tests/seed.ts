import Notifications from "../models/notifications";
import logger from "../utils/logger";
import connectDB from "../config/db";
import {config} from "../config/config"

const seedNotification = async () => {

    try{
        const feed = {
            title: 'Welcome',
            message: `With Carona, you get to share the ride with people going your way, enjoy a more 
            comfortable commute, and maybe even make a few new friends along the way. Plus,
            you're doing your part to take cars off the road, making Lagos a less chaotic city. 
            We think that's pretty cool. `,
            user: '660eab83b33e0419fde4e316'
        }

        const mongoUri = config.uri

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
        logger.error(`Error`)
        console.log(error)
        console.log(`Could not seed Notification DB Finally`)
    }

}

seedNotification()