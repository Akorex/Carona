import { Request, Response, NextFunction} from "express";
import logger from "../utils/logger";
import Trips from "../models/trips";
import Routes from "../models/routes";
import { errorResponse, successResponse } from "../utils/responses";
import { StatusCodes } from "http-status-codes";
import { calculateFare, generateDistance } from "../utils/trips";

export const createTrip = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        logger.info(`START: Create Trip Service`)
        const routeId = req.params.id
        const userId = req.user.userId

        // to do => ensure only signed-in users can createTrips
        // to do => automatically update caronago trips with passengerId
        // to do => automatically ensure caronashare trip creator is automatically in the passengerId 

        const {start, end, passengers, vehicleId} = req.body
        const tripData: {start: string; end: string; distance: string} = {start: '', end: '', distance: ''}

        if (!passengers || !vehicleId){
            logger.info(`END: Create Trip Service`)
            return errorResponse(
                res,
                StatusCodes.BAD_REQUEST,
                `Missing required trip parameters`
            )
        }

        if (routeId){
            // route are predefined -> likely a CaronaGo route
            const route = await Routes.findOne({_id: routeId})
            if (!route){
                logger.info(`END: Create Trip Service`)
                return errorResponse(res,
                    StatusCodes.BAD_REQUEST,
                    `Could not create Trip as Route is invalid`
                )
            }

            tripData.start = route.start
            tripData.end = route.end
            tripData.distance = route.distance

        }else{
            // route is not predefined -> likely a CaronaShare route
            tripData.start = start
            tripData.end = end
            tripData.distance = generateDistance()
        }

        const price = calculateFare(tripData.distance)
        
        const newTrip = await Trips.create({
            ...tripData,
            price,
            passengers,
            vehicleId
            })

            logger.info(`END: Create Trip Service`)
            successResponse(
                res,
                StatusCodes.OK,
                `Trip created succesfully`,
                newTrip
            )

        // payment service

        }

 catch(error){
        logger.error(`Could not create Trip ${error}`)
        next(error)
    }
}

export const getTrip = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        logger.info(`START: Get Trip Service`)

        const tripId = req.params.id
        const userId = req.user.userId

        const trip = await Trips.findOne({_id: tripId})

        if (!trip){
            logger.info(`END: Get Trip Service`)

            return errorResponse(
                res,
                StatusCodes.NOT_FOUND,
                `Trip not found`
            )
        }

        logger.info(`END: Get Trip Service`)
        successResponse(res,
            StatusCodes.OK,
            `Trip successfully fetched.`,
            trip
        )

    }catch(error){
        logger.error(`Could not get trip ${error}`)
        next(error)
    }
}

export const getAllTrips = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        // utility to get all trips by a user whether caronago or caronashare
        logger.info(`START: Get All Trips Service`)
        const userId = req.user.userId

        const trips = await Trips.find({passengers: {$in: [userId]}})

        if (!trips){
            logger.info(`END: Get All Trips Service`)
            return errorResponse(res,
                StatusCodes.NOT_FOUND,
                `No trips found for the passenger`
            )

        }

        logger.info(`END: Get All Trips Service`)
        successResponse(res,
            StatusCodes.OK,
            `Successfully fetched trips`,
            trips
        )

    }catch(error){
        logger.error(`Could not get All trips ${error}`)
        next(error)
    }

}


// restricted to CaronaShare Only => future work needed
// todo: reduce availableSeats by amount of users added to Trip
export const addPassengerToTrip = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        logger.info(`START: Add Passenger Service`)
        const passengers = req.body
        const tripId = req.params.id
        const userId = req.user.userId

        const trip = await Trips.findOneAndUpdate({_id: tripId, passengers: {$in: [userId]}}, 
            {passengers: [userId, passengers]},
            {runValidators: true, new: true}

        )

        if (!trip){
            logger.info(`END: Add Passenger Service`)

            return errorResponse(
                res,
                StatusCodes.BAD_REQUEST,
                `Could not update Trip as Trip is invalid`
            )
        }


        logger.info(`END: Add Passenger Service`)
        successResponse(res,
            StatusCodes.OK,
            `Successfully added passengers to Trip`,
            trip
        )


    }catch(error){
        logger.error(`Could not update trip ${error}`)
        next(error)
    }
}