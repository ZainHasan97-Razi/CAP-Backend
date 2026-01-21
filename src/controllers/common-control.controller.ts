import { ARequest } from "types/auth.request.type";
import { NextFunction, Response } from 'express';
import commonControlService from "../services/common-control.service";
import { ApiError } from "../middleware/validate.request";

export const create = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const commonControl = await commonControlService.create(req.body);
    res.status(201).json(commonControl);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const findById = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const commonControl = await commonControlService.findById(id);
    
    if (!commonControl) {
      throw ApiError.badRequest("Common control not found");
    }

    res.json(commonControl);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const update = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const commonControl = await commonControlService.update(id, req.body);
    
    if (!commonControl) {
      throw ApiError.badRequest("Common control not found");
    }

    res.json(commonControl);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const list = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const filters = {
      search: req.query.search as string,
      frameworkId: req.query.frameworkId as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10
    };
    
    const result = await commonControlService.list(filters);
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const findByFramework = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { frameworkId } = req.params;
    const commonControls = await commonControlService.findByFramework(frameworkId);
    res.json(commonControls);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const findByControl = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { controlId } = req.params;
    const commonControls = await commonControlService.findCommonControlsByControlId(controlId);
    res.json(commonControls);
  } catch (error) {
    console.error(error);
    next(error);
  }
};