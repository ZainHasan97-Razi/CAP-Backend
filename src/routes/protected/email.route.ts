import { Router } from 'express';
import emailController from '../../controllers/email.controller';

const router = Router();

router.post('/test', emailController.sendTestEmail);

export default router;