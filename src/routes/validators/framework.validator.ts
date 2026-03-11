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
  param('id').isMongoId().withMessage('ID must be a valid MongoDB ObjectId'),
  body("displayName").optional({ nullable: true, checkFalsy: true }).trim().not().isEmpty().withMessage("Invalid framework name"),
  body("status").optional({ nullable: true, checkFalsy: true }).isIn([Object.values(FrameworkStatusEnum)]).withMessage("Invalid status"),
  body("complianceMetric").optional(),
  body("complianceMetric.type").if(body('complianceMetric').exists()).isString().notEmpty().withMessage("Compliance metric type is required when complianceMetric is provided"),
  body("complianceMetric.label").if(body('complianceMetric').exists()).isString().notEmpty().withMessage("Compliance metric label is required when complianceMetric is provided"),
  body("complianceMetric.values").if(body('complianceMetric').exists()).isArray({min: 1}).withMessage("Compliance metric values must be a non-empty array when complianceMetric is provided"),
  body("complianceMetric.values.*.value").if(body('complianceMetric').exists()).isString().notEmpty().withMessage("Each value must have a string value field"),
  body("complianceMetric.values.*.label").if(body('complianceMetric').exists()).isString().notEmpty().withMessage("Each value must have a string label field"),
  body("complianceMetric.defaultValue").if(body('complianceMetric').exists()).isString().notEmpty().withMessage("Default value is required when complianceMetric is provided"),
]);

export const uploadCsvFramework_validation = validateRequest([
  body("displayName").trim().not().isEmpty().withMessage("Framework name is required"),
  body("type").isIn(Object.values(FrameworkTypeEnum)).withMessage("Invalid framework type"),
  // File validation will be handled in controller
]);

export const findById_validation = validateRequest([
  param('id').isMongoId().withMessage('ID must be a valid MongoDB ObjectId')
]);