import { Router } from 'express';
import { create, findAllActive, update } from '../../controllers/framework.controller';
import { createFramework_validation, updateFramework_validation } from '../validators/framework.validator';


const router = Router();

router.post('/create', createFramework_validation, create);
router.patch('/update', updateFramework_validation, update);
router.get('/list', findAllActive);

export default router;
