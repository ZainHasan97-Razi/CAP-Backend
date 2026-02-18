import { Router } from 'express';
import userRoute from './user.route';
import departmentRoute from './deprtment.route';
import roleRoute from './role.route';
import frameworkRoute from './framework.route';
import controlRoute from './control.route';
import commonControlRoute from './common-control.route';
import assesmentRoute from './assesment.route';
import assesmentCommentRoute from './assesment-comment.route';
import uploadRoute from './upload.route';
import seederRoute from './seeder.route';
import emailRoute from './email.route';

const router = Router();

router.use('/user', userRoute)
router.use('/department', departmentRoute)
router.use('/role', roleRoute)
router.use('/framework', frameworkRoute)
router.use('/control', controlRoute)
router.use('/common-control', commonControlRoute)
router.use('/assesment', assesmentRoute)
router.use('/assesment-comment', assesmentCommentRoute)
router.use('/upload', uploadRoute)
router.use('/seeder', seederRoute)
router.use('/email', emailRoute)

export default router;