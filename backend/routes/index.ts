import { Router } from "express";
import authRouter from "./auth";
import notificationRouter from "./notifications";
import paymentRouter from './payments'
import tripsRouter from "./trips";
import routesRouter from "./routes";
import vehicleRouter from "./vehicles";

const router = Router()
router.use('/auth', authRouter)

// admin only endpoints
router.use('/routes', routesRouter)
router.use('/vehicles', vehicleRouter)

// dashboard endpoints

router.use('/dashboard/notifications', notificationRouter)
router.use('/dashboard/payments', paymentRouter)
router.use('/dashboard/trips', tripsRouter)


export default router