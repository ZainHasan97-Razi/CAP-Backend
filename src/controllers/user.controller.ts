import { ARequest } from "types/auth.request.type";
import { NextFunction, Response } from 'express';
import userService from "../services/user.service";
import { ApiError } from "../middleware/validate.request";
import { IUser } from "types/req.user.type";
import { SystemRoleEnum } from "../models/system-role.model";
import userActivityService from "../services/user-activity.service";

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

    // Self-assignment prevention
    if (id === caller._id) {
      throw ApiError.forbidden('Super admins cannot modify their own roles');
    }

    const { systemRoles } = req.body;

    const targetUser = await userService.findById(id);
    if (!targetUser) throw ApiError.notFound('User not found');

    const user = await userService.updateSystemRoles(id, systemRoles);

    userActivityService.auditLog({
      userId: caller._id, userName: caller.userName, email: caller.email,
      sessionId: caller.sessionId,
      eventType: 'ADMIN_ACTION', eventSubtype: 'ROLE_ASSIGNED',
      resourceType: 'USER', resourceId: id,
      action: 'UPDATE',
      result: 'SUCCESS',
      beforeValue: { systemRoles: targetUser.systemRoles },
      afterValue:  { systemRoles },
      apiUrl: req.originalUrl, method: req.method,
    }).catch(() => {});

    res.json({ message: 'System roles updated', user });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export const updatePassword = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const caller = req.user as IUser;
    if (!caller.systemRoles?.includes(SystemRoleEnum.super_admin)) {
      throw ApiError.forbidden('Only super admins can update user passwords');
    }

    const { id } = req.params;
    const { password } = req.body;

    const user = await userService.findById(id);
    if (!user) throw ApiError.notFound('User not found');

    await userService.updatePassword(id, password);

    userActivityService.auditLog({
      userId: caller._id, userName: caller.userName, email: caller.email,
      sessionId: caller.sessionId,
      eventType: 'ADMIN_ACTION', eventSubtype: 'PASSWORD_RESET',
      resourceType: 'USER', resourceId: id,
      action: 'UPDATE', result: 'SUCCESS',
      apiUrl: req.originalUrl, method: req.method,
    }).catch(() => {});

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
}