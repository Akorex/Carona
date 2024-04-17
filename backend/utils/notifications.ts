
interface NotificationTimestamp{
    createdAt: Date,
    updatedAt: Date
}

interface IBasicNotification extends NotificationTimestamp{
    _id: any,
    title: string,
    message: string,
    userId: any,
    isReadFlag: boolean
}



export const getBasicNotification = (notification: IBasicNotification) => {
    const {
        _id,
        title,
        message,
        userId,
        isReadFlag
    } = notification

    return {
        title, message
    }


}