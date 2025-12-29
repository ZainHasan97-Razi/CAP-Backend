import { ARequest } from "types/auth.request.type";
import { NextFunction, Response } from 'express';
import userService from "../services/user.service";
import { ApiError } from "../middleware/validate.request";

export const findById = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const user = await userService.findById(id);
    if (!user) {
      throw ApiError.badRequest("User not found");
    }

    res.json({ message: 'Request success', user });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export const list = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const filters = {
      search: req.query.search as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10
    };
    
    const result = await userService.list(filters);
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
}