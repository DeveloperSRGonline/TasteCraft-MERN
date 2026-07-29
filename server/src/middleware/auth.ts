import express, { Request, Response, NextFunction } from 'express';
import { clerkMiddleware, getAuth } from '@clerk/express';
import { User } from '../models/User';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  mongoUser?: any;
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const auth = getAuth(req);
  if (!auth.userId) {
    res.status(401).json({ error: 'Unauthorized: No session token provided' });
    return;
  }

  req.userId = auth.userId;

  try {
    let mongoUser = await User.findOne({ clerkId: auth.userId });
    if (!mongoUser) {
      // Auto-create user doc if missing (fallback for dev environment before webhook runs)
      mongoUser = await User.create({
        clerkId: auth.userId,
        username: `user_${auth.userId.slice(-6)}`,
        email: `${auth.userId}@clerk.user`,
        role: 'user',
      });
    }
    req.mongoUser = mongoUser;
    next();
  } catch (err) {
    next(err);
  }
};
