import { Router } from 'express';
import publicRoutes from './public';
import protectedRoutes from './protected';
import { appRateLimiter } from '../middleware/rate.limitter';
import { protect } from '../middleware/protect';
import { userActivityMiddleware } from '../middleware/user-activity.middleware';

const router = Router();

// Public routes
router.use(appRateLimiter, publicRoutes);

// Protected routes
router.use(appRateLimiter, protect, userActivityMiddleware, protectedRoutes);

export default router;