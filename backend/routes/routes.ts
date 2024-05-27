import { Router } from "express";
import {isLoggedIn} from "../middlewares/authentication";
import {
    createRoute,
    deleteRoute,
    getRoute,
    getRoutes
} from "../controllers/routes"

const routesRouter = Router()

routesRouter.post(`/create-route`, isLoggedIn, createRoute) // will update to only allow admins create routes
routesRouter.get('/:id', isLoggedIn, getRoute)
routesRouter.get('/', isLoggedIn, getRoutes)
routesRouter.delete('/:id', isLoggedIn, deleteRoute)

export default routesRouter