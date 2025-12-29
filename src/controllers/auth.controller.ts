import { NextFunction, Request, Response } from 'express';
import userService from "../services/user.service";
import departmentService from "../services/department.service";
import { CreateUserDto } from "../models/user.model";
import { issueJwt } from "../utils/jwt";
import { ApiError } from '../middleware/validate.request';
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

    // Hash password
    const hashedpassword = await bcrypt.hash(body.password, 12);

    let payload: CreateUserDto = {
      ...req.body,
      password: hashedpassword,
      email: body.email.toLowerCase(),
      department: department.displayName,
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

    const token = issueJwt(user);
    if (!token) {
      // return res.status(500).json({ error: 'Error generating token' });
      throw ApiError.internalServer("Error generating token");
    }

    // In a real app, you would generate a JWT token here and send it back
    res.json({ user, token: token.token });
  } catch (error) {
    console.error(error);
    next(error); // pass to global handler
  }
}
