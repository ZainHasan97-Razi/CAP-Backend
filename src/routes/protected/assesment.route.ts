import { Router } from 'express';
import { create, dashboardList, findById, update, getAnalytics, getByMetric, importEvidence } from '../../controllers/assesment.controller';
import { createAssesment_validation, dashboardList_validation, findById_validation, updateAssesment_validation, analytics_validation, byMetric_validation, importEvidence_validation } from '../validators/assesment.validator';


const router = Router();

router.post('/create', createAssesment_validation, create);
router.put('/:id', updateAssesment_validation, update);
router.patch('/:id/import-evidence', importEvidence_validation, importEvidence);
router.get('/dashboard', dashboardList_validation, dashboardList);
router.get('/analytics', analytics_validation, getAnalytics);
router.get('/by-metric', byMetric_validation, getByMetric);
router.get('/:id', findById_validation, findById);

export default router;
