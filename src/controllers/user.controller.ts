import { ARequest } from "types/auth.request.type";
import { NextFunction, Response } from 'express';
import userService from "../services/user.service";
import { ApiError } from "../middleware/validate.request";
import { IUser } from "types/req.user.type";
import { SystemRoleEnum } from "../models/system-role.model";

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

export const findByDepartments = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const departmentIds = req.query.departmentIds as string;
    
    if (!departmentIds) {
      throw ApiError.badRequest("departmentIds query parameter is required");
    }
    
    const ids = departmentIds.split(',').map(id => id.trim());
    const users = await userService.findByDepartments(ids);
    
    res.json(users);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export const updateSystemRoles = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const caller = req.user as IUser;
    if (!caller.systemRoles?.includes(SystemRoleEnum.super_admin)) {
      throw ApiError.forbidden('Only super admins can update system roles');
    }

    const { id } = req.params;
    const { systemRoles } = req.body;

    const user = await userService.updateSystemRoles(id, systemRoles);
    if (!user) throw ApiError.notFound('User not found');

    res.json({ message: 'System roles updated', user });
  } catch (error) {
    console.error(error);
    next(error);
  }
}