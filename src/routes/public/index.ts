import { Router } from 'express';
import authRoute from './auth.route';
import departmentRoute from './department.route';
import roleRoute from './role.route';

const router = Router();

router.use('/auth', authRoute)
router.use('/department', departmentRoute)
router.use('/role', roleRoute)

export default router;
