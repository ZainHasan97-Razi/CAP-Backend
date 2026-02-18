import { Router } from 'express';
import { findAllRoles } from '../../controllers/role.controller';

const router = Router();

router.get('/list', findAllRoles);

export default router;
