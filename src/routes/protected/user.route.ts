import { Router } from 'express';
import { findById, list, findByDepartments, updateSystemRoles } from '../../controllers/user.controller';
import { list_validation } from '../validators/user.validator';
import { body } from 'express-validator';
import { validateRequest } from '../../middleware/validate.request';
import { SystemRoleEnum } from '../../models/system-role.model';

const router = Router();

router.get('/list', list_validation, list);
router.get('/by-departments', findByDepartments);
router.patch(
  '/:id/system-roles',
  validateRequest([
    body('systemRoles').isArray().withMessage('systemRoles must be an array'),
    body('systemRoles.*').isIn(Object.values(SystemRoleEnum)).withMessage('Invalid system role'),
  ]),
  updateSystemRoles
);
router.get('/:id', findById);

export default router;
