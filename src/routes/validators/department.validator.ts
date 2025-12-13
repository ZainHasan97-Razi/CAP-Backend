import { body, param, validationResult, check, query, ValidationError, Result } from "express-validator";
import { validateRequest } from "../../middleware/validate.request";
import { DepartmentStatusEnum } from "../../models/department.model";

export const createDepartment_validation = validateRequest([
  body("displayName").trim().not().isEmpty().withMessage("Invalid Department name"),
]);

export const updateDepartment_validation = validateRequest([
  body("displayName").optional({ nullable: true, checkFalsy: true }).trim().not().isEmpty().withMessage("Invalid Department name"),
  body("status").optional({ nullable: true, checkFalsy: true }).isIn([Object.values(DepartmentStatusEnum)]).withMessage("Invalid status"),
//   query('page').optional({ nullable: true, checkFalsy: true }).if(val => val !== null).isInt({min:1}).withMessage('Invalid page!')
]);