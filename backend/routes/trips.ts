import { Router } from "express";
import {isLoggedIn} from "../middlewares/authentication";
import { 
    createCaronaGoTrip,
    getTrip,
    getAllTrips
 } from "../controllers/trips";
import { addPassengerToCaronaShareTrip, createACaronaShareTrip, getAllAvailableCaronaShareTrips, sendRequestToJoinACaronaShareTrip } from "../controllers/caronashare";


const tripsRouter = Router()
export const createTripRouter = Router()
createTripRouter.post('/:routeId/trips', isLoggedIn, createCaronaGoTrip) 
tripsRouter.get('/:tripId', isLoggedIn, getTrip)
tripsRouter.get('/', isLoggedIn, getAllTrips)


// CARONA SHARE
tripsRouter.post('/caronashare/create', isLoggedIn, createACaronaShareTrip)
tripsRouter.post('/caronashare/share/:tripId', isLoggedIn, sendRequestToJoinACaronaShareTrip)
tripsRouter.post('/caronashare/share/:tripId/:passengerId', isLoggedIn, addPassengerToCaronaShareTrip)
tripsRouter.get('/caronashare/trips', isLoggedIn, getAllAvailableCaronaShareTrips)


export default tripsRouter