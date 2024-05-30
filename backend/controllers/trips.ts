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
    
}