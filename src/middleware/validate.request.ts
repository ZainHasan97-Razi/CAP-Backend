// validator.middleware.ts
import { validationResult } from "express-validator";
import { NextFunction, Response } from "express";
import { ARequest } from "../types/auth.request.type";

// errors/ApiError.ts
export class ApiError extends Error {
  statusCode: number;
  error: string;

  constructor(statusCode: number, message: string, error: string = "Bad Request") {
    super(message);
    this.statusCode = statusCode;
    this.error = error;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string) {
    return new ApiError(400, message, "Bad Request");
  }

  static unauthorized(message: string = "Unauthorized") {
    return new ApiError(401, message, "Unauthorized");
  }

  static forbidden(message: string = "Forbidden") {
    return new ApiError(403, message, "Forbidden");
  }

  static notFound(message: string = "Not Found") {
    return new ApiError(404, message, "Not Found");
  }
}

export const validateRequest = (validations: any[]) => {
  return async (req: ARequest, res: Response, next: NextFunction) => {
    for (let validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0]; // show only 1 error (cleaner)
      return next(ApiError.badRequest(firstError.msg));
    }

    next();
  };
};
