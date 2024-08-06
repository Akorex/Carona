import { Router } from "express";
import {isLoggedIn} from "../middlewares/authentication";
import { 
    createCaronaGoTrip,
    getTrip,
    getAllTrips
 } from "../controllers/trips";
import { createACaronaShareTrip } from "../controllers/caronashare";


const tripsRouter = Router()
export const createTripRouter = Router()
createTripRouter.post('/:routeId/trips', isLoggedIn, createCaronaGoTrip) 
tripsRouter.get('/:tripId', isLoggedIn, getTrip)
tripsRouter.get('/', isLoggedIn, getAllTrips)


// CARONA SHARE
tripsRouter.post('/caronashare/create', isLoggedIn, createACaronaShareTrip)


export default tripsRouter