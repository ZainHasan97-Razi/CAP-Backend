import { Router } from 'express';
import { create, findActiveByFramework, update, findByControlIdWithAssessments } from '../../controllers/control.controller';
import { createControl_validation, frameworkId_validation, updateControl_validation } from '../validators/control.validator';


const router = Router();

router.post('/create', createControl_validation, create);
router.patch('/update/:id', updateControl_validation, update);
router.get('/list/:frameworkId', frameworkId_validation, findActiveByFramework);
router.get('/details/:controlId', findByControlIdWithAssessments);

export default router;
