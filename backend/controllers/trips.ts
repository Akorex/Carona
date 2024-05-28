import { Request, Response, NextFunction} from "express";
import logger from "../utils/logger";
import Trips from "../models/trips";
import Routes from "../models/routes";
import { errorResponse, successResponse } from "../utils/responses";
import { StatusCodes } from "http-status-codes";
import { calculateFare } from "../utils/trips";

export const createTrip = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        logger.info(`START: Create Trip Service`)
        const routeId = req.params.id

        const route = await Routes.findOne({_id: routeId})
        if (!route){
            logger.info(`END: Create Trip Service`)
            return errorResponse(res,
                StatusCodes.BAD_REQUEST,
                `Could not create Trip as Route is invalid`
            )
        }

        const start = route.start
        const end = route.end
        const distance = route.distance
        const price = calculateFare(distance)

        const {
            passengers,
            vehicleId
        } = req.body

        const newTrip = await Trips.create({
            start,
            end,
            distance,
            price,
            passengers,
            vehicleId
        })

        logger.info(`END: Create Trip Service`)
        successResponse(res,
            StatusCodes.OK,
            `Trip created successfully`,
            newTrip
        )

    }catch(error){
        logger.error(`Could not create Trip ${error}`)
        next(error)
    }
}