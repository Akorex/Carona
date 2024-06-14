import { Request, Response, NextFunction} from "express";
import logger from "../utils/logger";
import Trips from "../models/trips";
import { errorResponse, successResponse } from "../utils/responses";
import { StatusCodes } from "http-status-codes";
import { getBasicTripDetails } from "../utils/trips";
import { updateVehicleSeats } from "./vehicles";
import ApiError from "../middlewares/errorHandler/api-error";
import User from "../models/auth";
import { getBasicVehicleDetails } from "../utils/vehicles";
import Vehicles from "../models/vehicles";
import Routes from "../models/routes";
import { calculateFare } from "../utils/trips";
import { generateDistance, generateEstimatedTravelTime } from "../utils/trips";
import { IBasicVehicle } from "../utils/vehicles";



export const createCaronaGoTrip = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        logger.info(`START: Create CaronaGo Trip Service`)
        const routeId = req.params.routeId
        const passengerId = req.user.userId

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

        const vehicle = await Vehicles.aggregate([{ $sample: { size: 1 } }])
        const route = await Routes.findOne({_id: routeId})

        if (!vehicle || vehicle.length === 0){
            return ApiError.badRequest(`Could not create Trip as no available Vehicle`)
        }
    
        if (!route){
            return ApiError.badRequest(`Could not create Trip as route is Invalid`)
        }
    
        const vehicleId = vehicle[0]._id;
        const availableSeats: number = vehicle[0].availableSeats;
    
        if (availableSeats <= 0){
            return ApiError.badRequest(`Could not create trip as no available seat.`)
        }

        const start = route.start
        const end = route.end
        const distance = route.distance
        const estimatedTravelTime = route.estimatedTravelTime
        const price = calculateFare(distance, estimatedTravelTime)
        const startLatLong = route.startLatLong
        const endLatLong = route.endLatLong

    
        const newTrip = await Trips.create({
            start,
            end,
            distance,
            estimatedTravelTime,
            price,
            vehicleId,
            passengers: passengerId
            })
        
        await updateVehicleSeats(vehicleId)
        
        //logger.info(`Sending mail about trip`) -> removing this functionality because sending email makes response
        //let firstName = user.firstName
        //let email = user.email
        //await successfulCaronaGoTrip(firstName, email) -> take longer

        logger.info(`END: Create Trip Service`)
        successResponse(
            res,
            StatusCodes.OK,
            `Trip created succesfully`,
            {trip: getBasicTripDetails(newTrip), 
            vehicle: await getBasicVehicleDetails(vehicle[0]), 
            coordinates: {startLatLong, endLatLong}}
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

        const vehicle = await Vehicles.findOne({_id: vehicleId})
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
        const startLatLong = '6.5162173597908, 3.3905528025338283'
        const endLatLong = '6.559633599898055, 3.3689000521288275'

    
        const newTrip = await Trips.create({
            start,
            end, 
            distance,
            estimatedTravelTime,
            price,
            vehicleId,
            passengers: passengerId
            })
        
        await updateVehicleSeats(vehicleId)
        
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
            {trip: getBasicTripDetails(trip), 
            vehicle: await getBasicVehicleDetails(vehicle),
            }
        )

    }catch(error){
        logger.error(`Could not get trip ${error}`)
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



export const getAllTrips = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        // utility to get all trips by a user whether caronago or caronashare
        logger.info(`START: Get All Trips Service`)
        const userId = req.user.userId

        const trips = await Trips.find({passengers: {$in: [userId]}}).populate('vehicleId')

        if (!trips || trips.length === 0){
            logger.info(`No trips found for the passenger with ID: ${userId}`)
            logger.info(`END: Get All Trips Service`)
            return errorResponse(res,
                StatusCodes.NOT_FOUND,
                `No trips found for the passenger`
            )

        }


        if (trips && trips.length > 0){
            const formattedTrips = await Promise.all(trips.map(async (trip) => {
                const vehicle = await Vehicles.findOne({_id: trip.vehicleId})

                if (!vehicle){
                    return 
                }
                const basicVehicle = await getBasicVehicleDetails(vehicle)

                return {
                    ...getBasicTripDetails(trip),
                    vehicle: basicVehicle
                }
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