import { NextFunction, Request, Response } from 'express';
import userService from "../services/user.service";
import departmentService from "../services/department.service";
import roleService from "../services/role.service";
import { CreateUserDto } from "../models/user.model";
import { issueJwt } from "../utils/jwt";
import { ApiError } from '../middleware/validate.request';
import { ARequest } from '../types/auth.request.type';
import { IUser } from '../types/req.user.type';
import crypto from 'crypto';
const bcrypt = require('bcryptjs');

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
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

    // Handle role - find or create
    const role = await roleService.findOrCreateRole(body.role);

    // Hash password
    const hashedpassword = await bcrypt.hash(body.password, 12);

    let payload: CreateUserDto = {
      ...req.body,
      password: hashedpassword,
      email: body.email.toLowerCase(),
      department: department.displayName,
      roleId: role._id,
      role: role.name,
    };

    const newUser = await userService.createUser(payload);

    res.status(201).json({ message: 'User created', userId: newUser.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
} 

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;

    // In a real app, you would check the password here with bcrypt!
    const user = await userService.findByEmail(body.email);
    if (!user) {
      // return res.status(401).json({ error: 'User is not registered' });
      throw ApiError.unauthorized("User is not registered");
    }
    const passwordIsValid = await bcrypt.compare(body.password, user.password);
    if (!passwordIsValid) {
      // return res.status(401).json({ error: 'Invalid password' });
      throw ApiError.unauthorized("Invalid password");
    }

    const sessionId = crypto.randomUUID();
    await userService.updateSessionId(user._id.toString(), sessionId);

    const token = issueJwt(user, sessionId);
    if (!token) {
      throw ApiError.internalServer("Error generating token");
    }

    res.json({ user, token: token.token });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export const logout = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;
    await userService.updateSessionId(user._id, null);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
}
