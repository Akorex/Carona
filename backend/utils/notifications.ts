import mongoose from "mongoose"
import { Timestamps } from "./auth"

interface IBasicNotification extends Timestamps{
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