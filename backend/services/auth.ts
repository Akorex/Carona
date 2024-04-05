import Notifications from "../models/notifications"


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