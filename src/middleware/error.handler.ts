// middlewares/error.middleware.ts
import { ApiError } from "./validate.request";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  // If it's our custom error
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      error: err.error,
    });
  }

  // Fallback for unknown errors
  return res.status(500).json({
    statusCode: 500,
    message: "Internal Server Error",
    error: "Server Error",
  });
};
