import { Router } from 'express';
import { requireApiKey, requireWebhookSecret } from '../../middleware/api-key.middleware';
import {
  listFrameworks,
  listControlsByFramework,
  getControlDetails,
  receiveAiResult,
} from '../../controllers/ai.controller';

const router = Router();

// External read routes — protected by API key (for AI team)
router.get('/frameworks', requireApiKey, listFrameworks);
router.get('/frameworks/:frameworkId/controls', requireApiKey, listControlsByFramework);
router.get('/controls/:controlCode', requireApiKey, getControlDetails);

// Webhook — protected by webhook secret (called by AI team)
router.post('/webhook/result', requireWebhookSecret, receiveAiResult);

export default router;
