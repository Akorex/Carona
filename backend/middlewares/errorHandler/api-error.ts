import {StatusCodes} from "http-status-codes"

class ApiError{
    code: number
    message: string

    constructor(code: number, message: string){
        this.code = code
        this.message = message
    }

    static notFound(): ApiError{
        return new ApiError(StatusCodes.NOT_FOUND, `Requested resource not found.`)
    }

    static badRequest(message: string): ApiError{
        return new ApiError(StatusCodes.BAD_REQUEST, message)
    }

    static internalError(): ApiError{
        return new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Internal server error.`)
    }

}

export default ApiError