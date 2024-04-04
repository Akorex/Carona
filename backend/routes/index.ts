import { Router } from "express";
import authRouter from "./auth";
import notificationRouter from "./notifications";

const router = Router()
router.use('/auth', authRouter)
router.use('/dashboard/notifications', notificationRouter)

export default router