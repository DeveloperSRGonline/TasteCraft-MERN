import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../lib/db';
import { Recipe } from '../lib/models/Recipe';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectDB();

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const recipe = await Recipe.findById(id);
      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }
      return res.status(200).json(recipe);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch recipe' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const recipe = await Recipe.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true, runValidators: true }
      );
      
      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }
      
      return res.status(200).json(recipe);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update recipe' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const recipe = await Recipe.findByIdAndDelete(id);
      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }
      return res.status(200).json({ message: 'Recipe deleted successfully', id });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete recipe' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}