import { NextFunction, Request, Response } from "express";
import { ARequest } from "../types/auth.request.type";
import { IUser } from "../types/req.user.type";
import { verifyToken } from "../utils/jwt";
import { ApiError } from "./validate.request";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(ApiError.unauthorized("Not authorized to access this route"));
  }

  try {
    const decoded = verifyToken(token) as IUser;

    if (!decoded) {
      return next(ApiError.unauthorized("Invalid token"));
    }

    (req as ARequest).user = decoded;

    next();
  } catch (err) {
    console.error("JWT Error:", err);
    return next(ApiError.unauthorized("Not authorized to access this route"));
  }
};
