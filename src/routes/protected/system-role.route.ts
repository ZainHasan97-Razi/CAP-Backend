import { Router } from 'express';
import { getAllSystemRoles, getPermissions, updateRolePermissions, seedSystemRoles } from '../../controllers/system-role.controller';
import { body, param } from 'express-validator';
import { validateRequest } from '../../middleware/validate.request';
import { SystemRoleEnum, PermissionEnum } from '../../models/system-role.model';

const router = Router();

router.get('/', getAllSystemRoles);
router.get('/permissions', getPermissions);

router.patch(
  '/:role/permissions',
  validateRequest([
    param('role').isIn(Object.values(SystemRoleEnum)).withMessage('Invalid system role'),
    body('permissions').isArray().withMessage('Permissions must be an array'),
    body('permissions.*').isIn(Object.values(PermissionEnum)).withMessage('Invalid permission key'),
  ]),
  updateRolePermissions
);

router.post('/seed', seedSystemRoles);

export default router;
