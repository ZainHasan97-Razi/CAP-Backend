import { Router } from 'express';
import userRoute from './user.route';
import departmentRoute from './deprtment.route';
import frameworkRoute from './framework.route';
import controlRoute from './control.route';
import assesmentRoute from './assesment.route';
import uploadRoute from './upload.route';

const router = Router();

router.use('/user', userRoute)
router.use('/department', departmentRoute)
router.use('/framework', frameworkRoute)
router.use('/control', controlRoute)
router.use('/assesment', assesmentRoute)
router.use('/upload', uploadRoute)

export default router;
