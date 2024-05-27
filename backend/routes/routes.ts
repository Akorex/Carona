import { Router } from "express";
import {isAdmin} from "../middlewares/authentication";
import {
    createRoute,
    deleteRoute,
    getRoute,
    getRoutes
} from "../controllers/routes"

const routesRouter = Router()

routesRouter.post(`/create`, isAdmin, createRoute) // will update to only allow admins create routes
routesRouter.get('/:id', isAdmin, getRoute)
routesRouter.get('/', isAdmin, getRoutes)
routesRouter.delete('/:id', isAdmin, deleteRoute)

export default routesRouter