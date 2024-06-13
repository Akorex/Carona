import { Request, Response, NextFunction} from "express";
import logger from "../utils/logger";
import Trips from "../models/trips";
import { errorResponse, successResponse } from "../utils/responses";
import { StatusCodes } from "http-status-codes";
import {  prepareInfoForCaronaGoTrip, prepareInfoForCaronaShareTrip} from "../utils/trips";
import { getBasicTripDetails } from "../utils/trips";
import { updateVehicleSeats } from "./vehicles";
import ApiError from "../middlewares/errorHandler/api-error";
import { successfulCaronaGoTrip } from "../services/trips";
import User from "../models/auth";
import { getBasicVehicleDetails } from "../utils/vehicles";
import Vehicles from "../models/vehicles";



export const createCaronaGoTrip = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        logger.info(`START: Create CaronaGo Trip Service`)
        const routeId = req.params.routeId
        const passengerId = req.user.userId

        let tripData: {start: string; 
            end: string; 
            distance: string; 
            estimatedTravelTime: string, 
            vehicleId: any, 
            price: string
        } = {start: '', end: '', distance: '', estimatedTravelTime: '', vehicleId: '', price: ''}

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

        let firstName = user.firstName
        let email = user.email

        const response  = await prepareInfoForCaronaGoTrip(routeId)

        if (response instanceof ApiError){
            logger.info(`END: Create Trip Service`)
            return errorResponse(
                res,
                StatusCodes.BAD_GATEWAY,
                response.message
            )
        }

        tripData = response

        const vehicle = tripData.vehicleId
    
        const newTrip = await Trips.create({
            ...tripData,
            passengers: passengerId
            })
        
        await updateVehicleSeats(tripData.vehicleId)
        logger.info(`Sending mail about trip`)
        await successfulCaronaGoTrip(firstName, email)

        logger.info(`END: Create Trip Service`)
        successResponse(
            res,
            StatusCodes.OK,
            `Trip created succesfully`,
            {trip: getBasicTripDetails(newTrip), vehicle: getBasicVehicleDetails(vehicle)}
        )

        }catch(error){
            logger.error(`Could not create Trip ${error}`)
            next(error)
        }


}

export const createCaronaShareTrip = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        logger.info(`START: Create CaronaShare Trip`)
        const passengerId = req.user.userId
        const {start, end, vehicleId} = req.body

        let tripData: {start: string; 
            end: string; 
            distance: string; 
            estimatedTravelTime: string, 
            vehicleId: any, 
            price: string
        } = {start: '', end: '', distance: '', estimatedTravelTime: '', vehicleId: '', price: ''}

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

        let firstName = user.firstName
        let email = user.email

        const response = await prepareInfoForCaronaShareTrip(start, end, vehicleId)

        if (response instanceof ApiError){
            logger.info(`END: Create Trip Service`)
            return errorResponse(
                res,
                StatusCodes.BAD_GATEWAY,
                response.message
            )
        }
        
        tripData = response

        const vehicle = tripData.vehicleId
    
        const newTrip = await Trips.create({
            ...tripData,
            passengers: passengerId
            })
        
        await updateVehicleSeats(tripData.vehicleId)
        logger.info(`Sending mail about trip`)
        await successfulCaronaGoTrip(firstName, email)

        logger.info(`END: Create Trip Service`)
        successResponse(
            res,
            StatusCodes.OK,
            `Trip created succesfully`,
            {trip: getBasicTripDetails(newTrip), vehicle: getBasicVehicleDetails(vehicle)}
        )
    }catch(error){
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

        const tripId = req.params.tripId
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

        const vehicle = await Vehicles.findOne({_id: trip.vehicleId})

        if (!vehicle){
            logger.info(`Fetching Vehicle`)
            return errorResponse(
                res,
                StatusCodes.NOT_FOUND,
                `Something went wrong while searching for trip`
            )
        }

        logger.info(`END: Get Trip Service`)
        successResponse(res,
            StatusCodes.OK,
            `Trip successfully fetched.`,
            {trip: getBasicTripDetails(trip), vehicle: getBasicVehicleDetails(vehicle)}
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

        if (!trips || trips.length === 0){
            logger.info(`No trips found for the passenger with ID: ${userId}`)
            logger.info(`END: Get All Trips Service`)
            return errorResponse(res,
                StatusCodes.NOT_FOUND,
                `No trips found for the passenger`
            )

        }


        if (trips && trips.length > 0){
            const formattedTrips = trips.map((trip) => ({
                start: trip.start,
                end: trip.end,
                estimatedTravelTime: trip.estimatedTravelTime,
                price: trip.price
            }))

            logger.info(`END: Get All Trips Service`)
            successResponse(res,
                StatusCodes.OK,
                `Successfully fetched trips`,
                {trips: formattedTrips, noOfTrips: formattedTrips.length}
            )


        }

    }catch(error){
        logger.error(`Could not get All trips ${error}`)
        next(error)
    }

}



export const updateTripRating = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        logger.info(`START: Update Ratings Service`)
        const userId = req.user.userId
        const tripId = req.params.tripId
        const ratings = req.body

        const trip = await Trips.findOneAndUpdate({_id: tripId, passengers: {$in: [userId]}}, 
            {ratings: ratings},
            {new: true, runValidators: true}
        )

        if (!trip){
            logger.info(`END: Update Ratings Service`)
            return errorResponse(res,
                StatusCodes.BAD_REQUEST,
                `Could not update trip ratings as Trip is invalid`
            )
        }

        logger.info(`END: Update Ratings Service`)
        successResponse(res,
            StatusCodes.OK,
            `Successfully updated ratings`,
            null
        )

    }catch(error){
        logger.error(`Could not update trip rating ${error}`)
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
        const tripId = req.params.tripId
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
            {trip: getBasicTripDetails(trip)}
        )


    }catch(error){
        logger.error(`Could not update trip ${error}`)
        next(error)
    }
}