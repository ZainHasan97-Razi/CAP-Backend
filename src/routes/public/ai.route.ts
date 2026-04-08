import { Router } from 'express';
import { requireApiKey, requireWebhookSecret } from '../../middleware/api-key.middleware';
import {
  listFrameworks,
  listControlsByFramework,
  getControlDetails,
  triggerAiAnalysis,
  receiveAiResult,
} from '../../controllers/ai.controller';

const router = Router();

// External read routes — protected by API key
router.get('/frameworks', requireApiKey, listFrameworks);
router.get('/frameworks/:frameworkId/controls', requireApiKey, listControlsByFramework);
router.get('/controls/:controlCode', requireApiKey, getControlDetails);

// Internal trigger — protected by API key (called from our own frontend/backend)
router.post('/assessments/:assessmentId/trigger', requireApiKey, triggerAiAnalysis);

// Webhook — protected by webhook secret (called by AI team)
router.post('/webhook/result', requireWebhookSecret, receiveAiResult);

export default router;
