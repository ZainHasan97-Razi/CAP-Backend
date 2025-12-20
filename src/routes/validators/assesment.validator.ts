import { body, param, check, query } from "express-validator";
import { validateRequest } from "../../middleware/validate.request";
import { AssesmentStatusEnum, PriorityEnum } from "../../models/assesment.model";
// import framewaorkService from "../../services/framewaork.service";

export const createAssesment_validation = validateRequest([
  body("assesmentId").trim().not().isEmpty().isLength({min: 1, max: 255}).withMessage("Assessment ID is required"),
  body("name").trim().not().isEmpty().isLength({min: 1, max: 255}).withMessage("Assessment name is required"),
  body("description").trim().not().isEmpty().isLength({min: 1, max: 1000}).withMessage("Assessment description is required"),
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
  body("displayName").optional({ nullable: true, checkFalsy: true }).trim().not().isEmpty().isLength({min: 1, max: 255}).withMessage("Display name cannot be empty"),
  body("status").optional({ nullable: true, checkFalsy: true }).isIn(Object.values(AssesmentStatusEnum)).withMessage("Status must be a valid value"),
]);