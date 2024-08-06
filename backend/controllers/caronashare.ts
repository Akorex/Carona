import {Request, Response, NextFunction} from 'express'
import logger from '../utils/logger'
import User from '../models/auth'
import { errorResponse, successResponse } from '../utils/responses'
import { OK, StatusCodes } from 'http-status-codes'
import Vehicles from '../models/vehicles'
import { generateDistance } from '../utils/trips'
import { calculateFare } from '../utils/trips'
import { generateEstimatedTravelTime } from '../utils/trips'
import Trips from '../models/trips'
import { getBasicTripDetails } from '../utils/trips'
import { getBasicVehicleDetails } from '../utils/vehicles'
import { sendRequestNotification } from '../services/tripNotification'
import { updateVehicleSeats } from './vehicles'

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
            type: vehicleType,
            model: vehicleModel,
            colour: vehicleColour,
            plateNumber: vehiclePlateNumber,
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


export const createACaronaShareTrip = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        logger.info(`START: Create CaronaShare Trip`)
        const passengerId = req.user.userId
        const {start, end} = req.body

        if (!passengerId){
            logger.info(`END: Create Trip Service`)
            return errorResponse(
                res,
                StatusCodes.BAD_REQUEST,
                `Missing required trip parameters`
            )
        }

        const user = await User.findOne({_id: passengerId})
        if (!user){
            logger.info(`END: Create Trip Service`)
            return errorResponse(
                res,
                StatusCodes.BAD_GATEWAY,
                `Couldn't fetch user details`
            )
        }

        const vehicle = await Vehicles.findOne({driverId: passengerId})
        if (!vehicle){
            logger.info(`END: Create Trip Service`)
            return errorResponse(
                res,
                StatusCodes.BAD_GATEWAY,
                `Couldn't fetch vehicle details`
            )
        }


        const distance = generateDistance()
        const estimatedTravelTime = generateEstimatedTravelTime()
        const price = calculateFare(distance, estimatedTravelTime)
        const startLatLong = '6.5162173597908, 3.3905528025338283' // placeholder for Caronashare coordinates
        const endLatLong = '6.559633599898055, 3.3689000521288275'
        const routeId = '1234' // replace 

    
        const newTrip = await Trips.create({
            start,
            end, 
            distance,
            estimatedTravelTime,
            price,
            vehicleId: vehicle._id,
            passengers: passengerId,
            type: 'caronashare'
            })
        
        //await updateVehicleSeats(vehicle._id)
        
        //logger.info(`Sending mail about trip`)     
        //let firstName = user.firstName
        //let email = user.email
        //await successfulCaronaGoTrip(firstName, email)

        logger.info(`END: Create Trip Service`)
        successResponse(
            res,
            StatusCodes.OK,
            `Trip created succesfully`,
            {trip: getBasicTripDetails(newTrip), 
            vehicle: await getBasicVehicleDetails(vehicle),
            coordinates: {startLatLong, endLatLong}}
        )
    }catch(error){
        logger.error(`Could not create Trip ${error}`)
        next(error)
    }
}


export const sendRequestToJoinACaronaShareTrip = async (req: Request, res: Response, next: NextFunction) => {
    try{
        logger.info(`START: Send Request for Trip Service`)
        const userId = req.user.userId
        const tripId = req.params.tripId

        if (!userId && !tripId){
            logger.info(`END: Send Request for Trip Service`)
            return errorResponse(
                res,
                StatusCodes.BAD_REQUEST,
                `Missing information required.`
            )
        }

        await sendRequestNotification(tripId, tripId, userId) // todo: replace second tripId

        logger.info(`END: Send Request for Trip Service`)
        successResponse(
            res,
            StatusCodes.OK,
            `Your request to join trip has been sent`,
            null
        )
        

    }catch(error){
        logger.error(`Could not send request ${error}`)
        next(error)
    }

}

export const getAllAvailableCaronaShareTrips = async (req: Request, res: Response, next: NextFunction) => {
    try{
        logger.info(`START: Get All Trips Service`)

        const trips = await Trips.find({type: 'caronashare'})


        logger.info(`END: Get All Trips Service`)
        successResponse(
            res,
            StatusCodes.OK,
            `Successfully fetched trips`,
            trips //to format properly
        )

    }catch(error){
        logger.error(`Could not get trips ${error}`)
        next(error)
    }
}