import { Router } from 'express';
import { createRole_validation } from '../validators/role.validator';
import { create } from '../../controllers/role.controller';

const router = Router();

router.post('/create', createRole_validation, create);

export default router;
