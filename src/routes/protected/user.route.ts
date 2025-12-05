import { Router } from 'express';
import { findById } from '../../controllers/user.controller';


const router = Router();

router.get('/:id', findById);

export default router;
