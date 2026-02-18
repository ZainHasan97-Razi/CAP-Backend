import { ARequest } from "types/auth.request.type";
import { NextFunction, Response } from 'express';
import roleService from '../services/role.service';
import { ApiError } from '../middleware/validate.request';

export const findAllRoles = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const roles = await roleService.findAll();
    res.json(roles);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const create = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;

    const existingRole = await roleService.findByName(name);
    if (existingRole) {
      throw ApiError.badRequest("Role already exists");
    }

    const role = await roleService.create({ name: name.trim(), description });
    res.json(role);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
