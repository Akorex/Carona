import { Router } from "express";
import authRouter from "./auth";
import notificationRouter from "./notifications";
import paymentRouter from './payments'

const router = Router()
router.use('/auth', authRouter)
router.use('/dashboard/notifications', notificationRouter)
router.use('/dashboard/payments', paymentRouter)

export default router