import { body, param } from "express-validator";
import { validateRequest } from "../../middleware/validate.request";

export const createComment_validation = validateRequest([
  param("assessmentId").isMongoId().withMessage("Assessment ID must be valid"),
  body("content").trim().isLength({min: 1, max: 2000}).withMessage("Content must be between 1-2000 characters"),
  body("attachments").optional().isArray().withMessage("Attachments must be an array"),
]);

export const createReply_validation = validateRequest([
  param("assessmentId").isMongoId().withMessage("Assessment ID must be valid"),
  param("commentId").isMongoId().withMessage("Comment ID must be valid"),
  body("content").trim().isLength({min: 1, max: 2000}).withMessage("Content must be between 1-2000 characters"),
  body("attachments").optional().isArray().withMessage("Attachments must be an array"),
]);

export const updateComment_validation = validateRequest([
  param("commentId").isMongoId().withMessage("Comment ID must be valid"),
  body("content").trim().isLength({min: 1, max: 2000}).withMessage("Content must be between 1-2000 characters"),
  body("attachments").optional().isArray().withMessage("Attachments must be an array"),
]);

export const deleteComment_validation = validateRequest([
  param("commentId").isMongoId().withMessage("Comment ID must be valid"),
]);

export const getComments_validation = validateRequest([
  param("assessmentId").isMongoId().withMessage("Assessment ID must be valid"),
]);