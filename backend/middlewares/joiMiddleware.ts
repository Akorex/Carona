import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import ApiError from "./errorHandler/api-error";


const joiMiddleware = (
  schema: Joi.Schema,
  property?: "body" | "query" | "params"
): ((req: Request, res: Response, next: NextFunction) => void) => {

  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property || "body"], {allowUnknown: true});
    
    if (error !== null && error?.details) {
      const { details }: Joi.ValidationError = error;
      const message = details
        .map((err: Joi.ValidationErrorItem) => err.message)
        .join(",");

      return next(new ApiError(422, message));
    }

    next();
  };
};

export default joiMiddleware;