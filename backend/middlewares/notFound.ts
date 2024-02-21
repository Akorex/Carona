import ApiError from "./errorHandler/api-error";
import { Request, Response, NextFunction } from "express";


const notFound = (req: Request, res: Response, next: NextFunction) => {
    next(ApiError.notFound())
}

export default notFound