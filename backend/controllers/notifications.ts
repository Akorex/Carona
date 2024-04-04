import { Request, Response, NextFunction } from "express"
import Notifications from "../models/notifications"
import logger from "../utils/logger"
import { successResponse, errorResponse } from "../utils/responses"
import { StatusCodes } from "http-status-codes"
import { getBasicNotification } from "../utils/notifications"

export const getAllNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try{
        logger.info(`START: Get All Notifications Service`)
        
        const user_id = req.user.userId

        const notifications = await Notifications.find({user: user_id})

        if (!notifications){
            logger.info(`END: Get All Notifications Service`)
            errorResponse(res,
                StatusCodes.NOT_FOUND,
                `No notification found`)
        }

        if (notifications && notifications.length > 0){
            const formattedNotifications = notifications.map((notification) =>({
                title: notification.title,
                message: notification.message
            }))
            
            logger.info(`END: Get All Notifications Service`)
            successResponse(
                res,
                StatusCodes.OK,
                `Successfully fetched notifications`,
                formattedNotifications
            )
        }

    }catch(error){
        logger.error(`Could not get Notifications`)
        next(error)
    }
}

export const getNotification = async (req: Request, res: Response, next: NextFunction) => {
    try{
        logger.info(`START: GET Notification Service`)

        const user_id = req.user.userId
        const notification_id = req.params.id

        const notification = await Notifications.findOne({_id: notification_id, user: user_id})

        if(!notification){
            logger.info(`END: Get Notification Service`)
            return errorResponse(res,
                StatusCodes.NOT_FOUND,
                `Could not find notification`)
        }

        logger.info(`END: Get Notification Service`)
        successResponse(res,
            StatusCodes.ACCEPTED,
            `Successfully returned notification`,
            {notification: getBasicNotification(notification)},
            )

    }catch(error){
        logger.error(`Could not get Notification`)
        next(error)
    }

}