import { Router } from 'express';
import userRoute from './user.route';
import frameworkRoute from './framework.route';
import controlRoute from './control.route';
import uploadRoute from './upload.route';

const router = Router();

router.use('/user', userRoute)
router.use('/framework', frameworkRoute)
router.use('/control', controlRoute)
router.use('/upload', uploadRoute)

export default router;
