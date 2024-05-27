import { Router } from "express";
import isLoggedIn from "../middlewares/authentication";
import { createVehicle, 
    deleteVehicle, 
    getAllVehicles, 
    getVehicle, 
    updateVehicleDetails } from "../controllers/vehicles";

const vehicleRouter = Router()

vehicleRouter.post('/create', createVehicle)
vehicleRouter.get('/', getAllVehicles)
vehicleRouter.get('/:id', getVehicle)
vehicleRouter.delete('/:id', deleteVehicle)
vehicleRouter.patch('/:id', updateVehicleDetails)

export default vehicleRouter