import { Request, Response, NextFunction } from 'express';
import { Recipe, IRecipe } from '../models/Recipe';

// Get Hero Recipe of the Day (weighted score: likes + rating*10 + order velocity)
export const getHeroRecipe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const recipes = await Recipe.find({ status: 'published' })
      .populate('author', 'username profilePic email')
      .lean();

    if (!recipes || recipes.length === 0) {
      // Fallback mock object if no published recipes exist in DB yet
      res.status(200).json({
        success: true,
        data: {
          _id: 'mock-hero-1',
          title: 'Wild Truffle & Mushroom Risotto',
          description: 'Hand-crafted Arborio rice infused with black winter truffle oil, wild forest mushrooms, and aged Parmigiano-Reggiano.',
          category: 'Main Dish',
          tags: ['Italian', 'Gourmet', 'Truffle'],
          ingredients: [
            { name: 'Arborio Rice', quantity: 200, unit: 'g', isOptional: false },
            { name: 'Black Truffle Oil', quantity: 15, unit: 'ml', isOptional: false },
            { name: 'Wild Mushrooms', quantity: 150, unit: 'g', isOptional: false },
            { name: 'Parmigiano-Reggiano', quantity: 50, unit: 'g', isOptional: false }
          ],
          steps: [
            { stepNumber: 1, instruction: 'Sauté wild mushrooms in butter until golden brown.' },
            { stepNumber: 2, instruction: 'Toast Arborio rice and gradually add warm vegetable broth.' },
            { stepNumber: 3, instruction: 'Finish with truffle oil and freshly grated Parmigiano.' }
          ],
          pricing: {
            isOrderable: true,
            price: 22.5,
            portionSizes: [
              { label: 'Standard (380g)', priceOffset: 0 },
              { label: 'Large (480g)', priceOffset: 5 }
            ]
          },
          stats: {
            likesCount: 342,
            ordersCount: 128,
            averageRating: 4.98
          },
          status: 'published',
          author: {
            username: 'Chef Marco',
            profilePic: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80'
          }
        }
      });
      return;
    }

    // Weighted score formula: (likes * 1) + (orders * 2) + (rating * 10)
    const scoredRecipes = recipes.map((recipe: IRecipe) => {
      const likes = recipe.stats?.likesCount || 0;
      const orders = recipe.stats?.ordersCount || 0;
      const rating = recipe.stats?.averageRating || 0;
      const score = likes * 1 + orders * 2 + rating * 10;
      return { recipe, score };
    });

    scoredRecipes.sort((a, b) => b.score - a.score);
    const heroRecipe = scoredRecipes[0].recipe;

    res.status(200).json({
      success: true,
      data: heroRecipe,
    });
  } catch (error) {
    next(error);
  }
};
