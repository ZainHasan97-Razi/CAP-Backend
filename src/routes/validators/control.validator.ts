import { body, param, validationResult, check, query, ValidationError, Result } from "express-validator";
import { NextFunction, Response } from "express";
import { validateRequest } from "../../middleware/validate.request";
import { ControlStatusEnum } from "../../models/control.model";
import framewaorkService from "../../services/framewaork.service";

export const createControl_validation = validateRequest([
  body("controlId").trim().not().isEmpty().withMessage("Invalid control id"),
  body("displayName").trim().not().isEmpty().withMessage("Invalid framework name"),
  body("frameworkId").trim().isMongoId().withMessage("Invalid framework has incorrect format")
  .custom(async (id) => {
    let framework = await framewaorkService.findById(id);
    if (!framework) {
      throw Error("Invalid framework ID");
    }
    return true;
  }),
]);

export const updateControl_validation = validateRequest([
  body("displayName").optional({ nullable: true, checkFalsy: true }).trim().not().isEmpty().withMessage("Invalid framework name"),
  body("status").optional({ nullable: true, checkFalsy: true }).isIn([Object.values(ControlStatusEnum)]).withMessage("Invalid status"),
//   query('page').optional({ nullable: true, checkFalsy: true }).if(val => val !== null).isInt({min:1}).withMessage('Invalid page!')
]);