import {Request, Response, NextFunction} from 'express'
import logger from '../utils/logger'
import Routes from '../models/routes'
import {errorResponse, successResponse} from '../utils/responses'
import { StatusCodes } from 'http-status-codes'
import { getBasicRouteDetails } from '../utils/routes'

export const createRoute = async (req: Request, res: Response, next: NextFunction) => {
    try{
        logger.info(`START: Create Route Service`)
        const {
            start,
            end,
            distance,
            estimatedTravelTime
        } = req.body


        const newRoute = await Routes.create({
            start,
            end,
            distance,
            estimatedTravelTime
        })

        logger.info(`END: Create Route Service`)
        successResponse(res,
            StatusCodes.OK,
            `Route created successfully`,
            {route: getBasicRouteDetails(newRoute)}
        )

    }catch(error){
        logger.error(`Could not create route ${error}`)
        next(error)
    }

}

export const deleteRoute = async (req: Request, res: Response, next: NextFunction) => {
    try{
        logger.info(`START: Delete Route Service`)
        const routeId = req.params.id

        await Routes.findOneAndDelete({_id: routeId})

        logger.info(`END: Delete Route Service`)

        successResponse(
            res,
            StatusCodes.OK,
            `Successfully deleted route`,
            null
        )


    }catch(error){
        logger.error(`Could not delete route ${error}`)
        next(error)
    }

}

export const getRoute = async (req: Request, res: Response, next: NextFunction) => {
    try{
        logger.info(`START: Get Route Service`)
        const routeId = req.params.id

        const route = await Routes.findOne({_id: routeId})

        if(!route){
            logger.info(`END: Get Route Service`)
            return errorResponse(res,
                StatusCodes.NOT_FOUND,
                `Route not found`
            )
        }

        logger.info(`END: Get Route Service`)
        successResponse(res,
            StatusCodes.OK,
            `Route found successfully`,
            {route: getBasicRouteDetails(route)}
        )
    }catch(error){
        logger.error(`Could not get route ${error}`)
        next(error)
    }

}

export const getAllRoutes = async (req: Request, res: Response, next: NextFunction) => {
    try{
        logger.info(`START: Get All Routes Service`)
        
        const routes = await Routes.find({})

        if (routes && routes.length > 0){
            const formattedRoutes = routes.map((route) => ({
                start: route.start,
                end: route.end,
                estimatedTravelTime: route.estimatedTravelTime,
                distance: route.distance
            }))


            logger.info(`END: Get All Routes Service`)
            successResponse(
                res,
                StatusCodes.OK,
                `Routes found successfully`,
                formattedRoutes
            )
        }else{
            logger.info(`END: Get All Routes Service`)
            return errorResponse(res,
                StatusCodes.NOT_FOUND,
                `No Route found`
            )
        }

    }catch(error){
        logger.error(`Could not get routes ${error}`)
        next(error)
    }

}


export const updateRouteDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        logger.info(`START: Update Route Service`)
        const routeId = req.params.id

        const {
            start,
            end,
            distance,
            estimatedTravelTime
        } = req.body

        const route = await Routes.findOneAndUpdate({_id: routeId},
            {start, end, distance, estimatedTravelTime},
            {new: true, runValidators: true}
        )

        if (!route){
            logger.info(`END: Update Route Service`)
            return errorResponse(
                res,
                StatusCodes.NOT_FOUND,
                `Route not found`
            )
        }

        logger.info(`END: Update Route Service`)
        successResponse(
            res,
            StatusCodes.OK,
            `Route detail updated successfully`,
            {route: getBasicRouteDetails(route)}
        )

    }catch(error){
        logger.error(`Could not update route detail ${error}`)
        next(error)
    }
}