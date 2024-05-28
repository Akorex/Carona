import { Router } from "express";
import {isLoggedIn} from "../middlewares/authentication";
import { createTrip } from "../controllers/trips";

const tripsRouter = Router()
tripsRouter.post('/:id', createTrip)

export default tripsRouter