import { ARequest } from "types/auth.request.type";
import { NextFunction, Response } from 'express';
import departmentService from "../services/department.service";
import { ApiError } from "../middleware/validate.request";
import { IUser } from "types/req.user.type";
import { SystemRoleEnum } from "../models/system-role.model";

export const create = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const caller = req.user as IUser;
    const allowed = [SystemRoleEnum.super_admin, SystemRoleEnum.executive];
    if (!caller?.systemRoles?.some(r => allowed.includes(r as any))) {
      throw ApiError.forbidden('Only super admins and executives can create departments');
    }

    const dept = await departmentService.create(req.body)

    res.json(dept);
  } catch (error) {
    console.error(error);
    next(error); // pass to global handler
  }
}

export const update = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const dept = await departmentService.update(id, req.body)
    if (!dept) {
      // return res.status(401).json({ error: 'Invalid framwork id' });
      throw ApiError.badRequest("Invalid framwork id");
    }

    res.json(dept);
  } catch (error) {
    console.error(error);
    next(error); // pass to global handler
  }
}

export const findActiveDepts = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const departments = await departmentService.findActiveDepts()

    res.json(departments);
  } catch (error) {
    console.error(error);
    next(error); // pass to global handler
  }
}