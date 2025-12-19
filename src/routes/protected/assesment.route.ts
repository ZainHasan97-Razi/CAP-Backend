import { Router } from 'express';
import { create, dashboardList } from '../../controllers/assesment.controller';
import { createAssesment_validation, updateAssesment_validation } from '../validators/assesment.validator';


const router = Router();

router.post('/create', createAssesment_validation, create);
// router.patch('/update', updateAssesment_validation, update);
router.get('/dashboard', dashboardList);

export default router;
