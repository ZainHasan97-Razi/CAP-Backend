import { Router } from 'express';
import { listLogFiles, downloadLogFile } from '../../controllers/system-log.controller';

const router = Router();

router.get('/list',              listLogFiles);
router.get('/download/:filename', downloadLogFile);

export default router;
