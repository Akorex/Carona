import { Router } from "express";
import {isAdmin} from "../middlewares/authentication";
import { createVehicle, 
    deleteVehicle, 
    getAllVehicles, 
    getVehicle, 
    updateVehicleDetails } from "../controllers/vehicles";

const vehicleRouter = Router()

vehicleRouter.post('/create', isAdmin, createVehicle)
vehicleRouter.get('/', isAdmin, getAllVehicles)
vehicleRouter.get('/:id', getVehicle)
vehicleRouter.delete('/:id', isAdmin, deleteVehicle)
vehicleRouter.patch('/:id', isAdmin, updateVehicleDetails)

export default vehicleRouter