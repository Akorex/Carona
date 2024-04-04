import mongoose from "mongoose"

interface IBasicNotification{
    _id: any,
    title: string,
    message: string,
    user: mongoose.Types.ObjectId,
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