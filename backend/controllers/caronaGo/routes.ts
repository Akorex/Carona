import {Request, Response, NextFunction} from 'express'
import logger from '../../utils/logger'
import Routes from '../../models/routes'

export const createRoute = async (req: Request, res: Response, next: NextFunction) => {
    try{
        logger.info(`START: Create Route Service`)
        const {start, end} = req.body

        // google maps api will fetch bus stops and distance 

        const newRoute = await Routes.create({
            start,
            end,
        })

    }catch(error){
        logger.info(`Could not create route ${error}`)
        next(error)
    }

}

export const deleteRoute = async (req: Request, res: Response, next: NextFunction) => {

}

export const getRoute = async (req: Request, res: Response, next: NextFunction) => {

}

export const getRoutes = async (req: Request, res: Response, next: NextFunction) => {

}

export const searchRoutes = async (req: Request, res: Response, next: NextFunction) => {

}

