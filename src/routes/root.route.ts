import { Router } from 'express';
import publicRoutes from './public/route';
import protectedRoutes from './protected/route';
import { appRateLimiter } from '../middleware/rate.limitter';
import { protect } from '../middleware/protect';

const router = Router();

// Public routes
router.use('/api', appRateLimiter, publicRoutes);

// Protected routes
router.use('/api', appRateLimiter, protect, protectedRoutes);

export default router;