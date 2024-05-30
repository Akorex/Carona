import { Router } from "express";
import {isLoggedIn} from '../middlewares/authentication'
import { payTicket } from "../controllers/payments";


const paymentRouter = Router()
paymentRouter.post('/pay/:id', isLoggedIn, payTicket)

export default paymentRouter