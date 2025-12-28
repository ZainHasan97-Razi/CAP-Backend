import { Router } from 'express';
import { create, dashboardList, findById } from '../../controllers/assesment.controller';
import { createAssesment_validation, dashboardList_validation, findById_validation } from '../validators/assesment.validator';


const router = Router();

router.post('/create', createAssesment_validation, create);
router.get('/dashboard', dashboardList_validation, dashboardList);
router.get('/:id', findById_validation, findById);

export default router;
