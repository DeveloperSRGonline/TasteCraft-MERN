import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getDashboardMetrics,
  getCreatorOrders,
  updateOrderStatus,
  getCreatorRecipes,
  toggleRecipeOrderable,
} from '../controllers/dashboardController';

const router = Router();

// Protect all dashboard routes
router.use(requireAuth as any);

// Metrics endpoint
router.get('/metrics', getDashboardMetrics as any);

// Incoming orders endpoint
router.get('/orders', getCreatorOrders as any);

// Update order status endpoint
router.patch('/orders/:id/status', updateOrderStatus as any);

// Recipe content management listing
router.get('/recipes', getCreatorRecipes as any);

// Toggle isOrderable
router.patch('/recipes/:id/toggle-orderable', toggleRecipeOrderable as any);

export default router;
