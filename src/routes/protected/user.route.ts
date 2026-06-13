import { Router } from 'express';
import { findById, list, findByDepartments, updateSystemRoles, updatePassword } from '../../controllers/user.controller';
import { logout, register } from '../../controllers/auth.controller';
import { list_validation, register_validation } from '../validators/user.validator';
import { body } from 'express-validator';
import { validateRequest } from '../../middleware/validate.request';
import { SystemRoleEnum } from '../../models/system-role.model';

const router = Router();

router.post('/register', register_validation, register);
router.post('/logout', logout);
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
router.patch(
  '/:id/password',
  validateRequest([
    body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ]),
  updatePassword
);
router.get('/:id', findById);

export default router;
