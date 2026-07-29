import { Router } from 'express';
import { handleClerkWebhook } from '../controllers/webhookController';

const router = Router();

router.post('/clerk', handleClerkWebhook);

export default router;
