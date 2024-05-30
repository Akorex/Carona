import { Request, Response, NextFunction } from "express";
import Vehicles from "../models/vehicles";
import {successResponse, errorResponse} from '../utils/responses'
import logger from '../utils/logger'
import { StatusCodes } from "http-status-codes";
import { getBasicVehicleDetails } from "../utils/vehicles";



export const createVehicle = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        logger.info(`START: Create Vehicle Service`)

        const {
            type,
            model,
            colour,
            plateNumber,
            availableSeats,
            driverId
        } = req.body


        const newVehicle = await Vehicles.create({
            type,
            model,
            colour,
            plateNumber,
            availableSeats,
            driverId
        })

        logger.info(`END: Create Vehicle Service`)
        successResponse(res,
            StatusCodes.OK,
            `Created a new vehicle successfully`,
            {vehicle: getBasicVehicleDetails(newVehicle)}
        )

    }catch(error){
        logger.error(`Could not create Vehicle ${error}`)
        next (error)
    }

}

export const deleteVehicle = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        logger.info(`START: Delete Vehicle Service`)

        const vehicleId = req.params.vehicleId

        await Vehicles.findByIdAndDelete({_id: vehicleId})

        logger.info(`END: Delete Vehicle Service`)

        successResponse(res,
            StatusCodes.OK,
            `Vehicle deleted successfully`,
            null
        )


    }catch(error){
        logger.error(`Could not delete vehicle ${error}`)
        next(error)

    }

}

export const getVehicle = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        logger.info(`START: Get Vehicle Service`)

        const vehicleId = req.params.vehicleId

        const vehicle = await Vehicles.findOne({_id: vehicleId})

        if (!vehicle){
            logger.info(`END: Get Vehicle Service`)

            return errorResponse(res,
                StatusCodes.NOT_FOUND,
                `Vehicle does not exist`
            )
        }

        logger.info(`END: Get Vehicle Service`)
        successResponse(res,
            StatusCodes.OK,
            `Successfully fetched vehicle`,
            {vehicle: getBasicVehicleDetails(vehicle)}
        )

    }catch(error){
        logger.error(`Could not get vehicle ${error}`)
        next(error)
    }
}

export const getAllVehicles = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        logger.info(`START: Get All Vehicles Service`)

        const vehicles = await Vehicles.find({})


        if (vehicles && vehicles.length > 0){
                const formattedVehicles = vehicles.map((vehicle) => ({
                    type: vehicle.type,
                    model: vehicle.model,
                    colour: vehicle.colour,
                    plateNumber: vehicle.plateNumber,
                    availableSeats: vehicle.availableSeats,
                    driverId: vehicle.driverId
                }))

            logger.info(`END: Get All Vehicles Service`)
            successResponse(res,
                StatusCodes.OK,
                `Successfully fetched vehicles`,
                {vehicles: formattedVehicles, noOfvehicles: formattedVehicles.length}
            )
        }
        else{
            logger.info(`END: Get All Vehicles Service`)
            return errorResponse(res,
                StatusCodes.NOT_FOUND,
                `No vehicle found.`
            )
        }

        
    }catch(error){
        logger.error(`Could not get vehicles ${error}`)
        next(error)
    }
}

export const updateVehicleDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        logger.info(`START: Update Vehicle Service`)
        const vehicleId = req.params.vehicleId

        const {
            type,
            model,
            colour,
            plateNumber,
            availableSeats,
        } = req.body

        const vehicle = await Vehicles.findOneAndUpdate({_id: vehicleId}, 
            {type, model, colour, plateNumber, availableSeats},
            {new: true, runValidators: true}
        )

        if (vehicle){
            logger.info(`END: Update Vehicle Service`)
            successResponse(res,
                StatusCodes.OK,
                `Successfully updated details`,
                {vehicle: getBasicVehicleDetails(vehicle)}
            )
        }else{
            logger.info(`END: Update Vehicle Service`)
            errorResponse(res,
                StatusCodes.NOT_FOUND,
                `Vehicle does not exist`
            )
        }


    }catch(error){
        logger.error(`Could not update vehicle detail ${error}`)
        next(error)
    }
}