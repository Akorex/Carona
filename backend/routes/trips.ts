import { Router } from "express";
import {isLoggedIn} from "../middlewares/authentication";
import { createTrip,
    getTrip,
    getAllTrips
 } from "../controllers/trips";

const tripsRouter = Router()
export const createTripRouter = Router()
createTripRouter.post('/routes/:routeId/trips', isLoggedIn, createTrip) // intended for caronago
//tripsRouter.post('/routes/:routeId/trips', isLoggedIn, createTrip) 
tripsRouter.post('/', isLoggedIn, createTrip) // intended for caronashare
tripsRouter.get('/:tripId', isLoggedIn, getTrip)
tripsRouter.get('/', isLoggedIn, getAllTrips)

export default tripsRouter