import { Router } from 'express';
import * as seederController from '../../controllers/seeder.controller';

const router = Router();

// Get available frameworks
router.get('/frameworks', seederController.getAvailableFrameworks);

// Seed operations
router.post('/seed/all', seederController.seedAll);
router.post('/seed/:frameworkName', seederController.seedFramework);

// Remove operations
router.delete('/remove/all', seederController.removeAll);
router.delete('/remove/:frameworkName', seederController.removeFramework);

// Reset operations (remove + seed)
router.post('/reset/all', seederController.resetAll);
router.post('/reset/:frameworkName', seederController.resetFramework);

export default router;