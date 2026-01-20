import { body, query, param } from "express-validator";
import { validateRequest } from "../../middleware/validate.request";

export const create_validation = validateRequest([
  body("displayName").trim().isLength({min: 1, max: 200}).withMessage("Display name must be between 1-200 characters"),
  body("description").trim().isLength({min: 1, max: 1000}).withMessage("Description must be between 1-1000 characters"),
  body("mappedControls").isArray().withMessage("Mapped controls must be an array"),
  body("mappedControls.*.frameworkId").isMongoId().withMessage("Framework ID must be valid"),
  body("mappedControls.*.frameworkName").trim().notEmpty().withMessage("Framework name is required"),
  body("mappedControls.*.controlId").isMongoId().withMessage("Control ID must be valid"),
  body("mappedControls.*.controlCode").trim().notEmpty().withMessage("Control code is required"),
  body("mappedControls.*.controlName").trim().notEmpty().withMessage("Control name is required")
]);

export const update_validation = validateRequest([
  param("id").isMongoId().withMessage("Invalid common control ID"),
  body("displayName").optional().trim().isLength({min: 1, max: 200}).withMessage("Display name must be between 1-200 characters"),
  body("description").optional().trim().isLength({min: 1, max: 1000}).withMessage("Description must be between 1-1000 characters"),
  body("mappedControls").optional().isArray().withMessage("Mapped controls must be an array"),
  body("status").optional().isIn(["active", "inactive"]).withMessage("Invalid status")
]);

export const list_validation = validateRequest([
  query('search').optional().isString().withMessage('Search must be a string'),
  query('frameworkId').optional().isMongoId().withMessage('Framework ID must be valid'),
  query('page').optional().isInt({min: 1}).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({min: 1, max: 100}).withMessage('Limit must be between 1-100')
]);

export const findById_validation = validateRequest([
  param("id").isMongoId().withMessage("Invalid common control ID")
]);

export const findByFramework_validation = validateRequest([
  param("frameworkId").isMongoId().withMessage("Invalid framework ID")
]);

export const findByControl_validation = validateRequest([
  param("controlId").isMongoId().withMessage("Invalid control ID")
]);