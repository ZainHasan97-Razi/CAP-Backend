import { body, param, validationResult, check, query, ValidationError, Result } from "express-validator";
import { NextFunction, Response } from "express";
import { validateRequest } from "../../middleware/validate.request";
import { FrameworkStatusEnum } from "../../models/framework.model";

export const createFramework_validation = validateRequest([
  body("displayName").trim().not().isEmpty().withMessage("Invalid framework name"),
]);

export const updateFramework_validation = validateRequest([
  body("displayName").optional({ nullable: true, checkFalsy: true }).trim().not().isEmpty().withMessage("Invalid framework name"),
  body("status").optional({ nullable: true, checkFalsy: true }).isIn([Object.values(FrameworkStatusEnum)]).withMessage("Invalid status"),
//   query('page').optional({ nullable: true, checkFalsy: true }).if(val => val !== null).isInt({min:1}).withMessage('Invalid page!')
]);