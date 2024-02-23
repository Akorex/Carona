import { Response } from "express"

export const errorResponse = (
    res: Response,
    statusCode: number,
    error: string
): void =>  {
    res.status(statusCode).send({status: 'error', error})
}



export const successResponse = <T> (
    res: Response,
    statusCode: number,
    message: string,
    data: T
): void => {
    res.status(statusCode).send({
        status: 'success',
        'message': message,
        data
    })
}