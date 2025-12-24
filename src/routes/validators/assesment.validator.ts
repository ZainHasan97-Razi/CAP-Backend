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

export const dashboardList_validation = validateRequest([
  query('status').optional().isIn(Object.values(AssesmentStatusEnum)).withMessage('Invalid status value'),
  query('department').optional().isMongoId().withMessage('Department must be a valid ID'),
  query('priority').optional().isIn(Object.values(PriorityEnum)).withMessage('Invalid priority value'),
  query('dateFrom').optional().isInt({min: 1}).withMessage('Date from must be a valid timestamp'),
  query('dateTo').optional().isInt({min: 1}).withMessage('Date to must be a valid timestamp'),
  query('dueDateFrom').optional().isInt({min: 1}).withMessage('Due date from must be a valid timestamp'),
  query('dueDateTo').optional().isInt({min: 1}).withMessage('Due date to must be a valid timestamp'),
  query('page').optional().isInt({min: 1}).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({min: 1, max: 100}).withMessage('Limit must be between 1-100')
]);