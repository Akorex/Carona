import { Router } from "express";
import authRouter from "./auth";
import notificationRouter from "./notifications";
import paymentRouter from './payments'
import tripsRouter from "./trips";
import routesRouter from "./routes";
import vehicleRouter from "./vehicles";
import { createTripRouter } from "./trips";

const router = Router()
router.use('/auth', authRouter)

// admin only endpoints
router.use('/routes', routesRouter)
router.use('/vehicles', vehicleRouter)

// dashboard endpoints

router.use('/notifications', notificationRouter)
router.use('/payments', paymentRouter)
router.use('/routes', createTripRouter)
router.use('/trips', tripsRouter)


export default router