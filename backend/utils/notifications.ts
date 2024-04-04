import mongoose from "mongoose"



interface NotificationTimestamp{
    createdAt: Date,
    updatedAt: Date
}

interface IBasicNotification extends NotificationTimestamp{
    _id: any,
    title: string,
    message: string,
    user: any,
    isReadFlag: boolean
}



export const getBasicNotification = (notification: IBasicNotification) => {
    const {
        _id,
        title,
        message,
        user,
        isReadFlag
    } = notification

    return {
        title, message
    }


}