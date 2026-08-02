import { NextFunction, Request, Response } from 'express';
import userService from "../services/user.service";
import departmentService from "../services/department.service";
import roleService from "../services/role.service";
import { CreateUserDto } from "../models/user.model";
import { issueJwt } from "../utils/jwt";
import { ApiError } from '../middleware/validate.request';
import { ARequest } from '../types/auth.request.type';
import { IUser } from '../types/req.user.type';
import { SystemRoleEnum } from '../models/system-role.model';
import userActivityService from '../services/user-activity.service';
import crypto from 'crypto';
const bcrypt = require('bcryptjs');

const getIp = (req: Request) =>
  (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
  req.socket?.remoteAddress || 'unknown';

export const register = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const caller = req.user as IUser;
    const allowed = [SystemRoleEnum.super_admin, SystemRoleEnum.compliance_specialist, SystemRoleEnum.compliance_manager];
    if (!caller?.systemRoles?.some(r => allowed.includes(r as any))) {
      throw ApiError.forbidden('You do not have permission to register new users');
    }

    const { body } = req;

    // Check if user exists
    const existingUser = await userService.findByEmail(body.email);
    if (existingUser) {
      throw ApiError.badRequest("User already exists");
    }

    // Get department name
    const department = await departmentService.findById(body.departmentId);
    if (!department) {
      throw ApiError.badRequest("Invalid department ID");
    }

    // Handle role - find or create (defaults to 'user' if not provided)
    const roleName = body.role || 'guest';
    const role = await roleService.findOrCreateRole(roleName);

    // Hash password
    const hashedpassword = await bcrypt.hash(body.password, 12);

    let payload: CreateUserDto = {
      ...req.body,
      password: hashedpassword,
      email: body.email.toLowerCase(),
      department: department.displayName,
      roleId: role._id,
      role: role.name,
      systemRoles: body.systemRoles ?? ['control_owner'],
    };

    const newUser = await userService.createUser(payload);

    userActivityService.auditLog({
      userId: caller._id, userName: caller.userName, email: caller.email,
      sessionId: caller.sessionId,
      ipAddress: getIp(req), userAgent: req.headers['user-agent'] || '',
      eventType: 'ADMIN_ACTION', eventSubtype: 'USER_CREATED',
      resourceType: 'USER', resourceId: newUser._id.toString(),
      action: 'CREATE', result: 'SUCCESS',
      afterValue: { email: payload.email, systemRoles: payload.systemRoles, department: payload.department },
      apiUrl: req.originalUrl, method: req.method,
    }).catch(() => {});

    res.status(201).json({ message: 'User created', userId: newUser.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
} 

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;
    const ip = getIp(req);
    const ua = req.headers['user-agent'] || '';

    const user = await userService.findByEmail(body.email);
    if (!user) {
      userActivityService.auditLog({
        userId: 'unknown', userName: 'unknown', email: body.email,
        ipAddress: ip, userAgent: ua,
        eventType: 'AUTHENTICATION', eventSubtype: 'LOGIN_FAILURE',
        result: 'FAILURE', failureReason: 'User not registered',
        apiUrl: req.originalUrl, method: req.method,
      }).catch(() => {});
      throw ApiError.unauthorized("User is not registered");
    }

    // Account lockout check
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      userActivityService.auditLog({
        userId: user._id.toString(), userName: user.userName, email: user.email,
        ipAddress: ip, userAgent: ua,
        eventType: 'AUTHENTICATION', eventSubtype: 'LOGIN_BLOCKED',
        resourceType: 'USER', resourceId: user._id.toString(),
        result: 'DENIED', failureReason: 'Account locked',
        apiUrl: req.originalUrl, method: req.method,
      }).catch(() => {});
      throw ApiError.unauthorized('Account is locked due to too many failed attempts. Try again later.');
    }

    const passwordIsValid = await bcrypt.compare(body.password, user.password);
    if (!passwordIsValid) {
      await userService.incrementFailedLogin(body.email);
      userActivityService.auditLog({
        userId: user._id.toString(), userName: user.userName, email: user.email,
        ipAddress: ip, userAgent: ua,
        eventType: 'AUTHENTICATION', eventSubtype: 'LOGIN_FAILURE',
        resourceType: 'USER', resourceId: user._id.toString(),
        result: 'FAILURE', failureReason: 'Invalid password',
        apiUrl: req.originalUrl, method: req.method,
      }).catch(() => {});
      throw ApiError.unauthorized("Invalid password");
    }

    const sessionId = crypto.randomUUID();
    await userService.updateSessionId(user._id.toString(), sessionId);
    await userService.resetFailedLogin(user._id.toString());

    const token = issueJwt(user, sessionId);
    if (!token) {
      throw ApiError.internalServer("Error generating token");
    }

    userActivityService.auditLog({
      userId: user._id.toString(), userName: user.userName, email: user.email,
      sessionId,
      ipAddress: ip, userAgent: ua,
      eventType: 'AUTHENTICATION', eventSubtype: 'LOGIN_SUCCESS',
      resourceType: 'USER', resourceId: user._id.toString(),
      result: 'SUCCESS',
      apiUrl: req.originalUrl, method: req.method,
    }).catch(() => {});

    const { password: _, sessionId: __, ...safeUser } = user.toObject();
    res.json({ user: safeUser, token: token.token });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export const logout = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;
    await userService.updateSessionId(user._id, null);

    userActivityService.auditLog({
      userId: user._id, userName: user.userName, email: user.email,
      sessionId: user.sessionId,
      eventType: 'AUTHENTICATION', eventSubtype: 'LOGOUT',
      resourceType: 'USER', resourceId: user._id,
      result: 'SUCCESS',
      apiUrl: req.originalUrl, method: req.method,
    }).catch(() => {});

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
}
