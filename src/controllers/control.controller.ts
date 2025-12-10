import { ARequest } from "types/auth.request.type";
import { NextFunction, Response } from 'express';
import controlService from "../services/control.service";
import { ApiError } from "../middleware/validate.request";

export const create = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const framework = await controlService.create(req.body)

    res.json({ message: 'Request success', framework });
  } catch (error) {
    console.error(error);
    next(error); // pass to global handler
  }
}

export const update = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const framework = await controlService.update(id, req.body)
    if (!framework) {
      // return res.status(401).json({ error: 'Invalid framwork id' });
      throw ApiError.badRequest("Invalid framwork id");
    }

    res.json({ message: 'Request success', framework });
  } catch (error) {
    console.error(error);
    next(error); // pass to global handler
  }
}