import { Router } from 'express';
import { findById, list } from '../../controllers/user.controller';
import { list_validation } from '../validators/user.validator';


const router = Router();

router.get('/list', list_validation, list);
router.get('/:id', findById);

export default router;
