import { Router } from 'express';
import { listActivities, exportActivities } from '../../controllers/user-activity.controller';

const router = Router();

router.get('/list',   listActivities);
router.get('/export', exportActivities);

export default router;
