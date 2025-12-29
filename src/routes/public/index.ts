import { Router } from 'express';
import authRoute from './auth.route';
import departmentRoute from './department.route';

const router = Router();

router.use('/auth', authRoute)
router.use('/department', departmentRoute)

export default router;
