import { Router } from 'express';
import { login, register } from '../../controllers/auth.controller'
import { login_validation } from '../validators/user.validator';

const router = Router();

router.post('/login', login_validation, login);
router.post('/register', register);

export default router;
