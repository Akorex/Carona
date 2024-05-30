import { Router } from "express";
import {isAdmin} from "../middlewares/authentication";
import {
    createRoute,
    deleteRoute,
    getRoute,
    getAllRoutes,
    updateRouteDetails
} from "../controllers/routes"

const routesRouter = Router()

routesRouter.post(`/create`, isAdmin, createRoute) 
routesRouter.get('/', getAllRoutes)
routesRouter.get('/:routeId', getRoute)
routesRouter.delete('/:routeId', isAdmin, deleteRoute)
routesRouter.patch('/:routeId', isAdmin, updateRouteDetails)

export default routesRouter