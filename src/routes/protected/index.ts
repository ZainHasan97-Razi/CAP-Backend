import { Router } from 'express';
import userRoute from './user.route';
import frameworkRoute from './framework.route';
import controlRoute from './control.route';

const router = Router();

router.use('/user', userRoute)
router.use('/framework', frameworkRoute)
router.use('/control', controlRoute)

export default router;
