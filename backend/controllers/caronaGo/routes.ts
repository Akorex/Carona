import {Request, Response, NextFunction} from 'express'
import logger from '../../utils/logger'
import Routes from '../../models/routes'
import { fetchDistance, fetchStops } from '../../utils/routes'
import {errorResponse, successResponse} from '../../utils/responses'
import { StatusCodes } from 'http-status-codes'
import { getBasicRouteInfo } from '../../utils/routes'

export const createRoute = async (req: Request, res: Response, next: NextFunction) => {
    try{
        logger.info(`START: Create Route Service`)
        const {start, end} = req.body

        // google maps api will fetch bus stops and distance 
        const distance = await fetchDistance(start, end)
        const stops = await fetchStops(start, end)

        const newRoute = await Routes.create({
            start,
            end,
            distance
        })

        logger.info(`END: Create Route Service`)
        successResponse(res,
            StatusCodes.OK,
            `Route created successfully`,
            null
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

        const route = await Routes.findOneAndDelete({_id: routeId})

        logger.info(`END: Delete Route Service`)


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
            {route: getBasicRouteInfo(route)}
        )
    }catch(error){
        logger.error(`Could not get route ${error}`)
        next(error)
    }

}

export const getRoutes = async (req: Request, res: Response, next: NextFunction) => {
    try{
        logger.info(`START: Get Routes Service`)
        
        const routes = await Routes.find({})
        logger.info(`END: Get Routes Service`)
        successResponse(res,
            StatusCodes.OK,
            `Routes found successfully`,
            {routes}
        )

    }catch(error){
        logger.error(`Could not get routes ${error}`)
        next(error)
    }

}



