import { body, param, validationResult, check, query, ValidationError, Result } from "express-validator";
import { NextFunction, Response } from "express";
import { validateRequest } from "../../middleware/validate.request";
import { ControlStatusEnum } from "../../models/control.model";
import framewaorkService from "../../services/framewaork.service";

export const createControl_validation = validateRequest([
  body("controlCode").trim().not().isEmpty().withMessage("Invalid control code"),
  body("controlName").trim().not().isEmpty().withMessage("Invalid control name"),
  body("domainCode").trim().not().isEmpty().withMessage("Invalid domain code"),
  body("domainName").trim().not().isEmpty().withMessage("Invalid domain name"),
  body("subdomainCode").optional().trim(),
  body("subdomainName").optional().trim(),
  body("description").optional().trim(),
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
  param("id").trim().isMongoId().withMessage("Invalid control id"),
  body("controlName").optional({ nullable: true, checkFalsy: true }).trim().not().isEmpty().withMessage("Invalid control name"),
  body("description").optional({ nullable: true, checkFalsy: true }).trim(),
  body("status").optional({ nullable: true, checkFalsy: true }).isIn(["active", "inactive"]).withMessage("Invalid status"),
  body().custom((value, { req }) => {
    const allowedFields = ['controlName', 'description', 'status'];
    const extraFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));
    if (extraFields.length > 0) {
      throw new Error(`Unexpected fields: ${extraFields.join(', ')}`);
    }
    return true;
  })
]);

export const findById_validation = validateRequest([
  param("id").isMongoId().withMessage("Invalid control ID")
]);

export const frameworkId_validation = validateRequest([
  param("frameworkId").trim().isMongoId().withMessage("Invalid framework id"),
  query("search").optional().trim().isLength({ min: 1 }).withMessage("Search term must be at least 1 character"),
  query("status").optional({ checkFalsy: true }).isIn(["active", "inactive"]).withMessage("Invalid status")
]);