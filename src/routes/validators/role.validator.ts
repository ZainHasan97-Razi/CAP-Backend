import { body } from "express-validator";
import { validateRequest } from "../../middleware/validate.request";

export const createRole_validation = validateRequest([
  body('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Role name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Role name must be between 2 and 50 characters'),
  body('description')
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
]);
