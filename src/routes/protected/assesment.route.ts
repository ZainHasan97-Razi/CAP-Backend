import { Router } from 'express';
import { create, dashboardList } from '../../controllers/assesment.controller';
import { createAssesment_validation, dashboardList_validation } from '../validators/assesment.validator';


const router = Router();

router.post('/create', createAssesment_validation, create);
router.get('/dashboard', dashboardList_validation, dashboardList);

export default router;
