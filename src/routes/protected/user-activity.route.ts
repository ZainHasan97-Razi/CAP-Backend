import { Router } from 'express';
import { listActivities } from '../../controllers/user-activity.controller';

const router = Router();

router.get('/list', listActivities);

export default router;
