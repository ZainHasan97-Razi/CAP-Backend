import { Router } from 'express';
import { createDepartment_validation, updateDepartment_validation } from '../validators/department.validator';
import { create, update, findActiveDepts } from '../../controllers/department.controller';


const router = Router();

router.post('/create', createDepartment_validation, create);
router.patch('/update', updateDepartment_validation, update);
router.get('/list', findActiveDepts);

export default router;
