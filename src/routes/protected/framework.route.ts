import { Router } from 'express';
import { create, update } from '../../controllers/framework.controller';
import { createFramework_validation, updateFramework_validation } from '../validators/framework.validator';


const router = Router();

router.post('/create', createFramework_validation, create);
router.patch('/update', updateFramework_validation, update);

export default router;
