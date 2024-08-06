import Notifications from "../models/notifications";
import Trips from "../models/trips";
import User from "../models/auth";


export const sendRequestNotification = async (tripId: any, tripCreator: any, tripJoiner: any) => {
    const trip = await Trips.findOne({_id: tripId})
    const start = trip?.start
    const end = trip?.end
    const tripCreatorName = (await User.findOne({_id: tripCreator}))?.firstName
    const tripJoinerName = (await User.findOne({_id: tripJoiner}))?.firstName


    const title = `Request to join Trip: ${start} - ${end}`
    const message = `Hello, ${tripCreatorName},
                        
                    An approved CaronaShare User, ${tripJoinerName},  wants to join your trip.
                    Please approve or reject this request.`

    await Notifications.create({
        title,
        message,
        userId: tripCreator // they receive the mail
    })
}