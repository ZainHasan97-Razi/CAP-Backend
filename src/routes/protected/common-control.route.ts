import { Router } from 'express';
import { create, findById, update, list, findByFramework, findByControl } from '../../controllers/common-control.controller';
import { 
  create_validation, 
  update_validation, 
  list_validation, 
  findById_validation,
  findByFramework_validation,
  findByControl_validation
} from '../validators/common-control.validator';

const router = Router();

router.post('/', create_validation, create);
router.get('/list', list_validation, list);
router.get('/framework/:frameworkId', findByFramework_validation, findByFramework);
router.get('/control/:controlId', findByControl_validation, findByControl);
router.get('/:id', findById_validation, findById);
router.put('/:id', update_validation, update);

export default router;