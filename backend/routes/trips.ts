import { Router } from "express";
import {isLoggedIn} from "../middlewares/authentication";
import { createTrip,
    getTrip,
    getAllTrips
 } from "../controllers/trips";

const tripsRouter = Router()
tripsRouter.post('/:id', isLoggedIn, createTrip)
tripsRouter.post('/', isLoggedIn, createTrip)
tripsRouter.get('/:id', isLoggedIn, getTrip)
tripsRouter.get('/', isLoggedIn, getAllTrips)

export default tripsRouter