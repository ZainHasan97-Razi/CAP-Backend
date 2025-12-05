import { Router } from 'express';
import publicRoutes from './public';
import protectedRoutes from './protected';
import { appRateLimiter } from '../middleware/rate.limitter';
import { protect } from '../middleware/protect';

const router = Router();

// Public routes
router.use(appRateLimiter, publicRoutes);

// Protected routes
router.use(appRateLimiter, protect, protectedRoutes);

export default router;