import { Router } from "express";
import {isLoggedIn} from "../middlewares/authentication";

const tripsRouter = Router()
tripsRouter.post('/trips')

export default tripsRouter