import { body, param, validationResult, check, query, ValidationError, Result } from "express-validator";
import moment from "moment";
import mongoose from "mongoose";
import { ARequest } from "../../types/auth.request.type";
import { NextFunction, Response } from "express";
import { validateRequest } from "../../middleware/validate.request";

export const login_validation = validateRequest([
//   body("fullName").trim().not().isEmpty().withMessage("Invalid full name"),
  body("email").isEmail().withMessage("Please enter a valid email."),
  body("password").trim().isLength({ min: 6 }).withMessage("Password is too short"),
]);