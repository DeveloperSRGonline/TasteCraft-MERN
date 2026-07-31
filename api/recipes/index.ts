import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../lib/db';
import { Recipe } from '../lib/models/Recipe';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectDB();

  const userId = req.headers['x-user-id'] as string || req.query.userId as string || 'user_1';
  const { search, category } = req.query;

  if (req.method === 'GET') {
    try {
      const query: any = { userId };
      
      if (search && typeof search === 'string') {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { ingredients: { $regex: search, $options: 'i' } },
        ];
      }

      if (category && category !== 'All') {
        query.category = category;
      }

      const recipes = await Recipe.find(query).sort({ createdAt: -1 });
      return res.status(200).json(recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      return res.status(500).json({ error: 'Failed to fetch recipes' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, description, ingredients, steps, category, userId: bodyUserId } = req.body;

      if (!title || !description || !category) {
        return res.status(400).json({ error: 'Title, description, and category are required' });
      }

      const recipe = await Recipe.create({
        title,
        description,
        ingredients: ingredients || [],
        steps: steps || [],
        category,
        userId: bodyUserId || userId,
        likesCount: 0,
        likedBy: [],
      });

      return res.status(201).json(recipe);
    } catch (error) {
      console.error('Error creating recipe:', error);
      return res.status(500).json({ error: 'Failed to create recipe' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}