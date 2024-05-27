import {Request, Response, NextFunction} from "express"
import ApiError from "./errorHandler/api-error"
import { isTokenValid } from "../utils/auth"
import User from "../models/auth";


// Define a custom interface to include the 'user' property
declare global {
    namespace Express {
      interface Request {
        user: {
          userId: string;
        };
      }
    }
  }

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']

    if (!authHeader){
        return next(ApiError.badRequest('Unauthorized'))
    }

    if (authHeader.startsWith('Bearer')){
        const token = authHeader.split(' ')[1]

        try{
            const payload: any = isTokenValid(token)
            req.user = {userId: payload.id}
            next()
        }catch(error){
            return next(ApiError.badRequest('Authentication failed'))
        }
    }else{
        return next(ApiError.badRequest('Invalid authorization header'))
    }
}

export const isAdmin =  (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // check if user is logged in

  isLoggedIn(
      req,
      res,
      async () => {
          if (! req.user){
              return next(ApiError.badRequest(`You are not authorized to use this resource.`))
          }

          let userId = req.user.userId
          const user = await User.findOne({_id: userId})

          if (!user){
            return next(ApiError.badRequest(`User is not found. Not authorized`))
          }

          if (user.role !== 'admin'){
              return next(ApiError.badRequest(`Admin access required.`))
          }

          next()
      }
  )
  
}
