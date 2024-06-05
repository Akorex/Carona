import { Request, Response, NextFunction} from "express";
import logger from "../utils/logger";
import Trips from "../models/trips";
import Routes from "../models/routes";
import { errorResponse, successResponse } from "../utils/responses";
import { StatusCodes } from "http-status-codes";
import { calculateFare, 
    generateDistance,
generateEstimatedTravelTime } from "../utils/trips";
import { getBasicTripDetails } from "../utils/trips";
import Vehicles from "../models/vehicles";
import { updateVehicleSeats } from "./vehicles";



export const createTrip = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        logger.info(`START: Create Trip Service`)
        const routeId = req.params.routeId
        const passengerId = req.user.userId

        const tripData: {start: string; end: string; distance: string; estimatedTravelTime: string, vehicleId: any} = {start: '', end: '', distance: '', estimatedTravelTime: '', vehicleId: ''}

        if (!passengerId){
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
            const vehicle = await Vehicles.aggregate([{ $sample: { size: 1 } }])


            // validating info on the vehicles

            if (!vehicle){
                logger.info(`END: Create Trip Service`)
                return errorResponse(
                    res,
                    StatusCodes.BAD_GATEWAY,
                    `Could not create Trip as Vehicle was not successfully fetched`
                )
            }

            const vehicleId = vehicle.map(obj => obj._id)
            const availableSeats:number = (vehicle.map(obj => obj.availableSeats))[0]

            if (availableSeats <= 0){
                logger.info(`END: Create Trip Service`)

                return errorResponse(
                    res,
                    StatusCodes.BAD_REQUEST,
                    `Could not create Trip as Seats has finished.`

                )
            }



            if (!route){
                logger.info(`END: Create Trip Service`)
                return errorResponse(
                    res,
                    StatusCodes.BAD_REQUEST,
                    `Could not create Trip as Route is invalid`
                )
            }

            tripData.start = route.start
            tripData.end = route.end
            tripData.distance = route.distance
            tripData.estimatedTravelTime = route.estimatedTravelTime
            tripData.vehicleId = vehicleId

        }else{
            // route is not predefined -> likely a CaronaShare route
            const {start, end, vehicleId} = req.body
            tripData.start = start
            tripData.end = end
            tripData.distance = generateDistance()
            tripData.estimatedTravelTime = generateEstimatedTravelTime()
            tripData.vehicleId = vehicleId
        }

        const price = calculateFare(tripData.distance, tripData.estimatedTravelTime)

        
        const newTrip = await Trips.create({
            ...tripData,
            price,
            passengers: passengerId
            })
        
        const newVehicleInfo = await updateVehicleSeats(tripData.vehicleId)  //reduce the number of available seats in the vehicle by 1

        logger.info(`END: Create Trip Service`)
        successResponse(
            res,
            StatusCodes.OK,
            `Trip created succesfully`,
            {trip: getBasicTripDetails(newTrip)}
        )

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

        logger.info(`END: Get Trip Service`)
        successResponse(res,
            StatusCodes.OK,
            `Trip successfully fetched.`,
            {trip: getBasicTripDetails(trip)}
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