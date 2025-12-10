import { Router } from 'express';
import { create, update } from '../../controllers/framework.controller';
import { createControl_validation, updateControl_validation } from '../validators/control.validator';


const router = Router();

router.post('/create', createControl_validation, create);
router.patch('/update', updateControl_validation, update);

export default router;
