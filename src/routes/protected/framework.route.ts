import { Router } from 'express';
import { create, findAllActive, update, uploadCsv } from '../../controllers/framework.controller';
import { createFramework_validation, updateFramework_validation, uploadCsvFramework_validation } from '../validators/framework.validator';
import upload from '../../config/multer.config';


const router = Router();

router.post('/create', createFramework_validation, create);
router.patch('/update', updateFramework_validation, update);
router.get('/list', findAllActive);
router.post('/upload-csv', upload.single('file'), uploadCsvFramework_validation, uploadCsv);

export default router;
