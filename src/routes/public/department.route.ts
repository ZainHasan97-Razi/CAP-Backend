import { Router } from 'express';
import { findActiveDepts } from '../../controllers/department.controller';

const router = Router();

router.get('/list', findActiveDepts);

export default router;