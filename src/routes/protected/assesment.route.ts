import { Router } from 'express';
import { create, getAssignedControls, assignControls, updateAssignedControl, getMyControls, dashboardList, findById, update, getAnalytics, getFrameworkSummaries, getFrameworkAnalytics, getByMetric, importEvidence, triggerAiAnalysis, bulkClose } from '../../controllers/assesment.controller';
import { createAssesment_validation, assignControls_validation, dashboardList_validation, findById_validation, updateAssesment_validation, analytics_validation, frameworkAnalytics_validation, byMetric_validation, importEvidence_validation } from '../validators/assesment.validator';
import { blockRoles } from '../../middleware/protect';
import { body, query, param } from 'express-validator';
import { validateRequest } from '../../middleware/validate.request';

const router = Router();

router.post('/create', blockRoles('super_admin'), createAssesment_validation, create);
router.patch('/:assesmentId/bulk-close', blockRoles('super_admin'), validateRequest([
  param('assesmentId').not().isEmpty().withMessage('Assessment ID is required'),
  body('recordIds').isArray({ min: 1 }).withMessage('recordIds must be a non-empty array'),
  body('recordIds.*').isMongoId().withMessage('Each recordId must be a valid MongoDB ObjectId'),
]), bulkClose);
router.post('/:assesmentId/assign-controls', blockRoles('super_admin'), assignControls_validation, assignControls);
router.get('/:assesmentId/assigned-controls', getAssignedControls);
router.patch(
  '/assigned-controls/:assessmentRecordId',
  blockRoles('super_admin'),
  validateRequest([
    body('departments').optional().isArray().withMessage('departments must be an array'),
    body('departments.*').optional().isMongoId().withMessage('Each department must be a valid id'),
    body('participants').optional().isArray().withMessage('participants must be an array'),
    body('participants.*').optional().isEmail().withMessage('Each participant must be a valid email'),
  ]),
  updateAssignedControl
);
router.get(
  '/my-controls',
  validateRequest([
    query('status').optional().isIn(['open', 'in_progress', 'closed']).withMessage('Invalid status'),
    query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1-100'),
  ]),
  getMyControls
);
router.put('/:id', blockRoles('super_admin'), updateAssesment_validation, update);
router.patch('/:id/import-evidence', blockRoles('super_admin'), importEvidence_validation, importEvidence);
router.post('/:id/trigger-ai', blockRoles('super_admin'), findById_validation, triggerAiAnalysis);
router.get('/dashboard', dashboardList_validation, dashboardList);
router.get('/analytics', analytics_validation, getAnalytics);
router.get('/framework-summaries', analytics_validation, getFrameworkSummaries);
router.get('/framework-analytics/:frameworkId', frameworkAnalytics_validation, getFrameworkAnalytics);
router.get('/by-metric', byMetric_validation, getByMetric);
router.get('/:id', findById_validation, findById);

export default router;
