import { body, param, check, query } from "express-validator";
import { validateRequest } from "../../middleware/validate.request";
import { AssesmentStatusEnum, PriorityEnum } from "../../models/assesment.model";
// import framewaorkService from "../../services/framewaork.service";

export const createAssesment_validation = validateRequest([
  body("assesmentId").trim().not().isEmpty().withMessage("Invalid control id"),
  body("name").trim().not().isEmpty().withMessage("Invalid framework name"),
  body("description").trim().not().isEmpty().withMessage("Invalid framework name"),
  body("framework").trim().isMongoId().withMessage("Invalid framework has incorrect format"),
  // // body("frameworkName").trim().not().isEmpty().withMessage("Invalid framework name"),
  body("control").trim().isMongoId().withMessage("Invalid control has incorrect format"),
  // body("controlId").trim().not().isEmpty().withMessage("Invalid framework name"),
  // body("controlName").trim().not().isEmpty().withMessage("Invalid framework name"),
  body("department").trim().isMongoId().withMessage("Invalid control has incorrect format"),
  body('participants').optional({ nullable: true, checkFalsy: true })
    .if(val => val !== null && Array.isArray(val) && val.length > 0)
    .isArray().withMessage('Invalid participants!'),
  body('attachments').optional({ nullable: true, checkFalsy: true })
    .if(val => val !== null && Array.isArray(val) && val.length > 0)
    .isArray().withMessage('Invalid attachments!'),
  body("priority").optional({ nullable: true, checkFalsy: true }).isIn(Object.values(PriorityEnum)).withMessage("Invalid priority"),
  body("dueDate").isInt({min:1}).withMessage('Invalid due date!'), // seconds


//   .custom(async (id) => {
//     let framework = await framewaorkService.findById(id);
//     if (!framework) {
//       throw Error("Invalid framework ID");
//     }
//     return true;
//   }),
]);

export const updateAssesment_validation = validateRequest([
  body("displayName").optional({ nullable: true, checkFalsy: true }).trim().not().isEmpty().withMessage("Invalid framework name"),
  body("status").optional({ nullable: true, checkFalsy: true }).isIn([Object.values(AssesmentStatusEnum)]).withMessage("Invalid status"),
//   query('page').optional({ nullable: true, checkFalsy: true }).if(val => val !== null).isInt({min:1}).withMessage('Invalid page!')
]);