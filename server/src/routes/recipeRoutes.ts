import { Router } from 'express';
import { getHeroRecipe } from '../controllers/recipeController';

const router = Router();

// GET /api/v1/recipes/hero-recipe
router.get('/hero-recipe', getHeroRecipe);

export default router;
