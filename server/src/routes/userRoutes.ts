import express, { Request, Response, NextFunction } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Recipe } from '../models/Recipe';

const router = express.Router();

// POST /api/v1/users/toggle-like/:recipeId
router.post('/toggle-like/:recipeId', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { recipeId } = req.params;
    const userId = req.mongoUser._id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      res.status(404).json({ success: false, error: 'Recipe not found' });
      return;
    }

    const savedIndex = user.savedRecipes.indexOf(recipe._id);
    let isLiked = false;

    if (savedIndex > -1) {
      // Unlike
      user.savedRecipes.splice(savedIndex, 1);
      recipe.stats.likesCount = Math.max(0, recipe.stats.likesCount - 1);
    } else {
      // Like
      user.savedRecipes.push(recipe._id);
      recipe.stats.likesCount += 1;
      isLiked = true;
    }

    await user.save();
    await recipe.save();

    res.json({
      success: true,
      isLiked,
      likesCount: recipe.stats.likesCount,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/users/toggle-follow/:targetUserId
router.post('/toggle-follow/:targetUserId', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { targetUserId } = req.params;
    const currentUserId = req.mongoUser._id;

    if (currentUserId.toString() === targetUserId) {
      res.status(400).json({ success: false, error: 'You cannot follow yourself' });
      return;
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const followingIndex = currentUser.following.indexOf(targetUser._id);
    let isFollowing = false;

    if (followingIndex > -1) {
      // Unfollow
      currentUser.following.splice(followingIndex, 1);
      const followerIndex = targetUser.followers.indexOf(currentUser._id);
      if (followerIndex > -1) targetUser.followers.splice(followerIndex, 1);
    } else {
      // Follow
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);
      isFollowing = true;
    }

    await currentUser.save();
    await targetUser.save();

    res.json({
      success: true,
      isFollowing,
      followersCount: targetUser.followers.length,
    });
  } catch (error) {
    next(error);
  }
});

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
