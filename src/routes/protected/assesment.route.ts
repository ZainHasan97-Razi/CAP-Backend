import { Router } from 'express';
import { create, dashboardList, findById, update } from '../../controllers/assesment.controller';
import { createAssesment_validation, dashboardList_validation, findById_validation, updateAssesment_validation } from '../validators/assesment.validator';


const router = Router();

router.post('/create', createAssesment_validation, create);
router.put('/:id', updateAssesment_validation, update);
router.get('/dashboard', dashboardList_validation, dashboardList);
router.get('/:id', findById_validation, findById);

export default router;
