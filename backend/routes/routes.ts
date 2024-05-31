import { Router } from "express";
import {isAdmin, isLoggedIn} from "../middlewares/authentication";
import {
    createRoute,
    deleteRoute,
    getRoute,
    getAllRoutes,
    updateRouteDetails
} from "../controllers/routes"

const routesRouter = Router()

routesRouter.post(`/create`, isAdmin, createRoute) 
routesRouter.get('/', isLoggedIn, getAllRoutes)
routesRouter.get('/:routeId', isLoggedIn, getRoute)
routesRouter.delete('/:routeId', isAdmin, deleteRoute)
routesRouter.patch('/:routeId', isAdmin, updateRouteDetails)

export default routesRouter