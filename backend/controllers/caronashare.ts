import {Request, Response, NextFunction} from 'express'
import logger from '../utils/logger'
import User from '../models/auth'
import { errorResponse, successResponse } from '../utils/responses'
import { StatusCodes } from 'http-status-codes'
import Vehicles from '../models/vehicles'


export const registerCaronaShareUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
        logger.info(`START: Register for Carona Share Service`)
        const userId = req.user.userId
        const {
            NIN,
            vehicleType,
            vehicleModel,
            vehicleColour,
            vehiclePlateNumber,
        } = req.body

        const user = await User.findOne({_id: userId})

        if (!user){
            logger.info(`END: Register for Carona Share Service`)
            return errorResponse(
                res,
                StatusCodes.BAD_REQUEST,
                `Invalid user`
            )
        }

        const newVehicle = await Vehicles.create({
            vehicleType,
            vehicleModel,
            vehicleColour,
            vehiclePlateNumber,
            driverId: userId
        })

        logger.info(`END: Register for Carona Share Service`)
        successResponse(
            res,
            StatusCodes.OK,
            `Successfully registered for Carona Share. Awaiting approval`,
            null
        )

    }catch(error){
        logger.error(`Could not register carona share user`)
        next(error)
    }

}

export const approveCaronaShareUser = async (req:Request, res: Response, next: NextFunction) => {
    try{
        logger.info(`START: Approve Carona Share User Service`)
        const userId = req.params.userId

        if (!userId){
            logger.info(`END: Approve Carona Share User Service`)
            return errorResponse(
                res,
                StatusCodes.BAD_REQUEST,
                `Insufficient information to approve user`
            )
        }

        const user = await User.findOneAndUpdate({_id: userId}, {role: 'caronashare'}, {new: true, runValidators: true})

        if (!user){
            logger.info(`END: Approve Carona Share User Service`)
            return errorResponse(
                res,
                StatusCodes.NOT_FOUND,
                `Could not find that user`
            )
        }

        // send email to user that they can now share their rides with other approved users

        successResponse(
            res,
            StatusCodes.OK,
            `Success.`,
            null
        )

    }catch(error){
        logger.error(`Could not approve the carona share user`)
        next(error)
    }

}


export const registerCaronaUserWithoutCar = async (req: Request, res: Response, next: NextFunction) => {
    try{
        logger.info(`START: Register A Carona User Without Car Service`)
        const userId = req.user.userId

        const {NIN} = req.body

        if (!userId){
            logger.info(`END: Register A Carona User Without Car Service`)
            return errorResponse(res,
                StatusCodes.BAD_REQUEST,
                `Missing information`
            )
        }

        const user = await User.findOne({_id: userId})

        if (!user){
            logger.info(`END: Register A Carona User Without Car Service`)
            return errorResponse(
                res,
                StatusCodes.NOT_FOUND,
                `Could not find that user`
            )
        }

        logger.info(`END: Register A Carona User Without Car Service`)
        successResponse(
            res,
            StatusCodes.OK,
            `Successfully registered for Carona Share. Awaiting approval`,
            null
        )

    }catch(error){
        logger.error(`Could not register user`)
        next(error)
    }
}


export const createACaronaShareTrip = async (req: Request, res: Response, next: NextFunction) => {
    try{

    }catch(error){

    }
}

export const joinACaronaShareTrip = async (req: Request, res: Response, next: NextFunction) => {
    try{

    }catch(error){
        
    }
}