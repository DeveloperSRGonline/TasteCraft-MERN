import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../../lib/db';
import { Recipe } from '../../lib/models/Recipe';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectDB();

  const { id } = req.query;
  const userId = req.headers['x-user-id'] as string || 'user_1';

  if (req.method === 'POST') {
    try {
      const recipe = await Recipe.findById(id);
      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      const isLiked = recipe.likedBy?.includes(userId);
      
      if (isLiked) {
        recipe.likedBy = recipe.likedBy.filter((id: string) => id !== userId);
        recipe.likesCount = Math.max(0, recipe.likesCount - 1);
      } else {
        recipe.likedBy.push(userId);
        recipe.likesCount += 1;
      }

      await recipe.save();
      return res.status(200).json(recipe);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to toggle like' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}