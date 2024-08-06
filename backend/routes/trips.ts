import { Router } from "express";
import {isLoggedIn} from "../middlewares/authentication";
import { 
    createCaronaGoTrip,
    createCaronaShareTrip,
    getTrip,
    getAllTrips
 } from "../controllers/trips";
import { registerCaronaShareUser } from "../controllers/caronashare";

const tripsRouter = Router()
export const createTripRouter = Router()
createTripRouter.post('/:routeId/trips', isLoggedIn, createCaronaGoTrip) 
tripsRouter.post('/', isLoggedIn, createCaronaShareTrip) 
tripsRouter.get('/:tripId', isLoggedIn, getTrip)
tripsRouter.get('/', isLoggedIn, getAllTrips)


// CARONA SHARE


export default tripsRouter