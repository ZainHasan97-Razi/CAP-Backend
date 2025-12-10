import { ARequest } from "types/auth.request.type";
import { NextFunction, Response } from 'express';
import userService from "../services/user.service";
import { ApiError } from "../middleware/validate.request";

export const findById = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // In a real app, you would check the password here with bcrypt!
    const user = await userService.findById(id);
    if (!user) {
      // return res.status(401).json({ error: 'User not found' });
      throw ApiError.badRequest("User not found");
    }

    // In a real app, you would generate a JWT token here and send it back
    res.json({ message: 'Request success', user });
  } catch (error) {
    console.error(error);
    next(error); // pass to global handler
  }
}