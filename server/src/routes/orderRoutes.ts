import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleRazorpayWebhook,
} from '../controllers/orderController';

const router = Router();

// Create Razorpay order (protected)
router.post('/create-razorpay-order', requireAuth as any, createRazorpayOrder as any);

// Verify payment signature (protected)
router.post('/verify-payment', requireAuth as any, verifyRazorpayPayment as any);

// Razorpay Webhook backup listener (unprotected, raw signature verified)
router.post('/webhook', handleRazorpayWebhook as any);

export default router;
