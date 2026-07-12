import { Router } from 'express';
import { create, findActiveByFramework, update, findByControlCodeWithAssessments, findById } from '../../controllers/control.controller';
import { createControl_validation, frameworkId_validation, updateControl_validation, findById_validation } from '../validators/control.validator';
import { blockRoles } from '../../middleware/protect';


const router = Router();

router.post('/create', createControl_validation, create);
router.patch('/update/:id', blockRoles('control_owner', 'executive', 'auditor'), updateControl_validation, update);
router.get('/list/:frameworkId', frameworkId_validation, findActiveByFramework);
router.get('/details/:controlCode', findByControlCodeWithAssessments);
router.get('/:id', findById_validation, findById);

export default router;
