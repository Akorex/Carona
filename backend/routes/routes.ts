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
routesRouter.get('/:id', getRoute)
routesRouter.delete('/:id', isAdmin, deleteRoute)
routesRouter.patch('/:id', isAdmin, updateRouteDetails)

export default routesRouter