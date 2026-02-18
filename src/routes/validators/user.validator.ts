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

export const list_validation = validateRequest([
  query('search').optional().isString().withMessage('Search must be a string'),
  query('page').optional().isInt({min: 1}).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({min: 1, max: 100}).withMessage('Limit must be between 1-100')
]);

export const register_validation = validateRequest([
  body("userName").trim().isLength({min: 3, max: 50}).withMessage("Username must be between 3-50 characters"),
  body("email").isEmail().withMessage("Please enter a valid email."),
  body("password").trim().isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role").trim().not().isEmpty().withMessage("Role is required"),
  body("departmentId").isMongoId().withMessage("Department ID must be valid"),
]);