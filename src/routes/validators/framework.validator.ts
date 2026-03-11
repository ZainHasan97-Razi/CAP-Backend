import { body, param, validationResult, check, query, ValidationError, Result } from "express-validator";
import { NextFunction, Response } from "express";
import { validateRequest } from "../../middleware/validate.request";
import { FrameworkStatusEnum, FrameworkTypeEnum } from "../../models/framework.model";

export const createFramework_validation = validateRequest([
  body("displayName").trim().not().isEmpty().withMessage("Invalid framework name"),
  body("complianceMetric").exists().withMessage("Compliance metric is required"),
  body("complianceMetric.type").isString().notEmpty().withMessage("Compliance metric type is required"),
  body("complianceMetric.label").isString().notEmpty().withMessage("Compliance metric label is required"),
  body("complianceMetric.values").isArray({min: 1}).withMessage("Compliance metric values must be a non-empty array"),
  body("complianceMetric.values.*.value").isString().notEmpty().withMessage("Each value must have a string value field"),
  body("complianceMetric.values.*.label").isString().notEmpty().withMessage("Each value must have a string label field"),
  body("complianceMetric.defaultValue").isString().notEmpty().withMessage("Default value is required"),
]);

export const updateFramework_validation = validateRequest([
  body("displayName").optional({ nullable: true, checkFalsy: true }).trim().not().isEmpty().withMessage("Invalid framework name"),
  body("status").optional({ nullable: true, checkFalsy: true }).isIn([Object.values(FrameworkStatusEnum)]).withMessage("Invalid status"),
  body("complianceMetric").optional(),
  body("complianceMetric.type").optional().isString().withMessage("Compliance metric type must be a string"),
  body("complianceMetric.label").optional().isString().withMessage("Compliance metric label must be a string"),
  body("complianceMetric.values").optional().isArray({min: 1}).withMessage("Compliance metric values must be a non-empty array"),
  body("complianceMetric.values.*.value").optional().isString().withMessage("Each value must have a string value field"),
  body("complianceMetric.values.*.label").optional().isString().withMessage("Each value must have a string label field"),
  body("complianceMetric.defaultValue").optional().isString().withMessage("Default value must be a string"),
//   query('page').optional({ nullable: true, checkFalsy: true }).if(val => val !== null).isInt({min:1}).withMessage('Invalid page!')
]);

export const uploadCsvFramework_validation = validateRequest([
  body("displayName").trim().not().isEmpty().withMessage("Framework name is required"),
  body("type").isIn(Object.values(FrameworkTypeEnum)).withMessage("Invalid framework type"),
  // File validation will be handled in controller
]);