import { Router } from 'express';
import {
  getExploreRecipes,
  getMyRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getHeroRecipe,
  generateAIRecipe,
} from '../controllers/recipeController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/explore', getExploreRecipes);
router.get('/hero-recipe', getHeroRecipe);
router.get('/:id', getRecipeById);

// Protected routes (Requires Auth)
router.get('/my-recipes', requireAuth, getMyRecipes);
router.post('/', requireAuth, createRecipe);
router.patch('/:id', requireAuth, updateRecipe);
router.delete('/:id', requireAuth, deleteRecipe);
router.post('/ai-generate', generateAIRecipe);

export default router;
