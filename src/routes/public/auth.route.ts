import { Router } from 'express';
import { login } from '../../controllers/auth.controller'
import { login_validation } from '../validators/user.validator';

const router = Router();

router.post('/login', login_validation, login);

export default router;
