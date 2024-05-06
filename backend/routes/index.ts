import { Router } from "express";
import authRouter from "./auth";
import notificationRouter from "./notifications";
import paymentRouter from './payments'
import tripsRouter from "./trips";
import routesRouter from "./routes";

const router = Router()
router.use('/auth', authRouter)
router.use('/routes', routesRouter)
router.use('/dashboard/notifications', notificationRouter)
router.use('/dashboard/payments', paymentRouter)
router.use('/dashboard/trips', tripsRouter)


export default router