import { ARequest } from "types/auth.request.type";
import { NextFunction, Response } from 'express';
import controlService from "../services/control.service";
import { ApiError } from "../middleware/validate.request";

export const create = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const control = await controlService.create(req.body)
    res.json(control);
  } catch (error) {
    console.error(error);
    next(error); // pass to global handler
  }
}

export const update = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const control = await controlService.update(id, req.body)
    if (!control) {
      // return res.status(401).json({ error: 'Invalid framwork id' });
      throw ApiError.badRequest("Invalid framwork id");
    }

    res.json(control);
  } catch (error) {
    console.error(error);
    next(error); // pass to global handler
  }
}

export const findActiveByFramework = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    console.log('cominggggggggggg');
    
    const controls = await controlService.findActiveByFramework(req.params.frameworkId)

    res.json(controls);
  } catch (error) {
    console.error(error);
    next(error); // pass to global handler
  }
}