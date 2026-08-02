import { Router } from 'express';
import { getSettings, toggleAi } from '../../controllers/settings.controller';

const router = Router();

router.get('/', getSettings);
router.patch('/ai-toggle', toggleAi);

export default router;
