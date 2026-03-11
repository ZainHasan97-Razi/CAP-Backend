import { Router } from 'express';
import { create, findAllActive, findById, update, uploadCsv } from '../../controllers/framework.controller';
import { createFramework_validation, findById_validation, updateFramework_validation, uploadCsvFramework_validation } from '../validators/framework.validator';
import upload from '../../config/multer.config';


const router = Router();

router.post('/create', createFramework_validation, create);
router.patch('/:id', updateFramework_validation, update);
router.get('/list', findAllActive);
router.get('/:id', findById_validation, findById);
router.post('/upload-csv', upload.single('file'), uploadCsvFramework_validation, uploadCsv);

export default router;
