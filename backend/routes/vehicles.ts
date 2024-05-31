import { Router } from "express";
import {isAdmin, isLoggedIn} from "../middlewares/authentication";
import { createVehicle, 
    deleteVehicle, 
    getAllVehicles, 
    getVehicle, 
    updateVehicleDetails } from "../controllers/vehicles";

const vehicleRouter = Router()

vehicleRouter.post('/create', isAdmin, createVehicle)
vehicleRouter.get('/', isAdmin, getAllVehicles)
vehicleRouter.get('/:vehicleId', isLoggedIn, getVehicle)
vehicleRouter.delete('/:vehicleId', isAdmin, deleteVehicle)
vehicleRouter.patch('/:vehicleId', isAdmin, updateVehicleDetails)

export default vehicleRouter