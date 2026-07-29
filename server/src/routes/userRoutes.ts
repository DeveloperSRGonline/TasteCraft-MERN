import express, { Request, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { User } from '../models/User';

const router = express.Router();

// GET /api/v1/users/me — Get authenticated user details from MongoDB
router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, user: req.mongoUser });
});

// PATCH /api/v1/users/role — Update user role (for testing: promote to creator or admin)
router.patch('/role', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { role } = req.body;
  if (!['user', 'creator', 'admin'].includes(role)) {
    res.status(400).json({ error: 'Invalid role' });
    return;
  }

  const updatedUser = await User.findOneAndUpdate(
    { clerkId: req.userId },
    { role },
    { new: true }
  );

  res.json({ success: true, user: updatedUser });
});

export default router;
