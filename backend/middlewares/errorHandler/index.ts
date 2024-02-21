import ApiError from "./api-error"
import logger from '../../utils/logger'
import {JsonWebTokenError} from 'jsonwebtoken'
import { ErrorRequestHandler, NextFunction, Request, Response } from "express"
import {errorResponse} from "../../utils/responses"

const errorHandler = (
    error: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let message = "Oops. Something went wrong. Please try again later."
    let errCode = 500

    if (error instanceof ApiError){
        message = error.message
        errCode = error.code
    }else if (error instanceof JsonWebTokenError){
        message = error.message
        errCode = 403
    }else if (error instanceof Error){
        message = error.message
        errCode = 422
    }else if (
        error instanceof SyntaxError ||
        error instanceof EvalError ||
        error instanceof RangeError ||
        error instanceof ReferenceError ||
        error instanceof TypeError ||
        error instanceof URIError
    ){
        message = error.message
        errCode = 400
    }

    logger.error(`[${req.method} ${req.url}]
        ${typeof message === 'string' ? message: JSON.stringify(message)}`)

    errorResponse(res, errCode, message)
    
}

export default errorHandler