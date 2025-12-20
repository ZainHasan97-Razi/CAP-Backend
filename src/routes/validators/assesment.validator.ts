import { body, param, check, query } from "express-validator";
import { validateRequest } from "../../middleware/validate.request";
import { AssesmentStatusEnum, PriorityEnum } from "../../models/assesment.model";
// import framewaorkService from "../../services/framewaork.service";

export const createAssesment_validation = validateRequest([
  body("assesmentId").trim().not().isEmpty().withMessage("Assessment ID is required").isLength({min: 1, max: 255}).withMessage("Assessment ID must be between 1-255 characters"),
  body("name").trim().not().isEmpty().withMessage("Assessment name is required").isLength({min: 1, max: 255}).withMessage("Assessment name must be between 1-255 characters"),
  body("description").trim().not().isEmpty().withMessage("Assessment description is required").isLength({min: 1, max: 1000}).withMessage("Assessment description must be between 1-1000 characters"),
  body("framework").trim().isMongoId().withMessage("Framework must be a valid ID"),
  body("control").trim().isMongoId().withMessage("Control must be a valid ID"),
  body("department").trim().isMongoId().withMessage("Department must be a valid ID"),
  body('participants').optional({ nullable: true, checkFalsy: true })
    .isArray().withMessage('Participants must be an array'),
  body('attachments').optional({ nullable: true, checkFalsy: true })
    .isArray().withMessage('Attachments must be an array'),
  body("priority").optional({ nullable: true, checkFalsy: true }).isIn(Object.values(PriorityEnum)).withMessage("Priority must be a valid value"),
  body("dueDate").isInt({min:1}).withMessage('Due date must be a valid timestamp'), // seconds


//   .custom(async (id) => {
//     let framework = await framewaorkService.findById(id);
//     if (!framework) {
//       throw Error("Invalid framework ID");
//     }
//     return true;
//   }),
]);

export const updateAssesment_validation = validateRequest([
  body("displayName").optional({ nullable: true, checkFalsy: true }).trim().not().isEmpty().withMessage("Display name cannot be empty").isLength({min: 1, max: 255}).withMessage("Display name must be between 1-255 characters"),
  body("status").optional({ nullable: true, checkFalsy: true }).isIn(Object.values(AssesmentStatusEnum)).withMessage("Status must be a valid value"),
]);