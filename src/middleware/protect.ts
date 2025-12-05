import { NextFunction, Request, Response } from 'express';
import ErrorHandler from './error.handler';
import { ARequest } from '../types/auth.request.type';
import { IUser } from '../types/req.user.type';
import { verifyToken } from '../utils/jwt';

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token)
    return next(new ErrorHandler('Not authorized to access this route', 401));

  try {
    const decoded: IUser = verifyToken(token);

    if (!decoded) {
      return next(new ErrorHandler('Invalid Tokens', 401));
    }

    (req as ARequest).user = decoded;

    return next();
  } catch (err) {
    console.log(err);
    return next(new ErrorHandler('Not authorized to access this route', 401));
  }
};
