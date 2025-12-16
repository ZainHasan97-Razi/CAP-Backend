import { Router } from 'express';
import { create } from '../../controllers/assesment.controller';
import { createAssesment_validation, updateAssesment_validation } from '../validators/assesment.validator';


const router = Router();

router.post('/create', createAssesment_validation, create);
// router.patch('/update', updateAssesment_validation, update);

export default router;
