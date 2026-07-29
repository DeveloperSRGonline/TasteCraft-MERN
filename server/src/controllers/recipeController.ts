import { Request, Response, NextFunction } from 'express';
import { Recipe } from '../models/Recipe';
import { AuthenticatedRequest } from '../middleware/auth';
import { generateRecipeWithAI } from '../services/aiService';

// GET /api/v1/recipes/explore - Paginated explore feed with filter & search
export const getExploreRecipes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string;
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    const queryFilter: any = { status: 'published' };

    if (category && category !== 'All') {
      queryFilter.category = category;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      queryFilter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { tags: searchRegex },
        { 'ingredients.name': searchRegex },
      ];
    }

    const [recipes, total] = await Promise.all([
      Recipe.find(queryFilter)
        .populate('author', 'username profilePic bio')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Recipe.countDocuments(queryFilter),
    ]);

    res.status(200).json({
      success: true,
      data: recipes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/recipes/my-recipes - Fetch current user's authored recipes
export const getMyRecipes = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authorId = req.mongoUser._id;
    const recipes = await Recipe.find({ author: authorId })
      .populate('author', 'username profilePic bio')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: recipes,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/recipes/:id - Fetch single recipe details
export const getRecipeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'username profilePic bio followers')
      .lean();

    if (!recipe) {
      res.status(404).json({ success: false, error: 'Recipe not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/recipes - Create new recipe
export const createRecipe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, category, tags, ingredients, steps, pricing, mealAddons, status } = req.body;

    if (!title || !description || !category) {
      res.status(400).json({ success: false, error: 'Title, description, and category are required.' });
      return;
    }

    const newRecipe = await Recipe.create({
      title,
      description,
      category,
      tags: tags || [],
      ingredients: ingredients || [],
      steps: steps || [],
      pricing: pricing || { isOrderable: false, price: 0, portionSizes: [] },
      mealAddons: mealAddons || [],
      author: req.mongoUser._id,
      status: status || 'published',
    });

    const populatedRecipe = await Recipe.findById(newRecipe._id).populate('author', 'username profilePic bio');

    res.status(201).json({
      success: true,
      data: populatedRecipe,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/recipes/:id - Update existing recipe
export const updateRecipe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      res.status(404).json({ success: false, error: 'Recipe not found' });
      return;
    }

    // Ensure author ownership or admin role
    if (recipe.author.toString() !== req.mongoUser._id.toString() && req.mongoUser.role !== 'admin') {
      res.status(403).json({ success: false, error: 'Unauthorized to update this recipe' });
      return;
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('author', 'username profilePic bio');

    res.status(200).json({
      success: true,
      data: updatedRecipe,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/recipes/:id - Archive or delete recipe
export const deleteRecipe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      res.status(404).json({ success: false, error: 'Recipe not found' });
      return;
    }

    // Ensure author ownership or admin role
    if (recipe.author.toString() !== req.mongoUser._id.toString() && req.mongoUser.role !== 'admin') {
      res.status(403).json({ success: false, error: 'Unauthorized to delete this recipe' });
      return;
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// GET Hero Recipe of the Day (weighted score: likes + rating*10 + order velocity)
export const getHeroRecipe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const recipes = await Recipe.find({ status: 'published' })
      .populate('author', 'username profilePic email')
      .lean();

    if (!recipes || recipes.length === 0) {
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

    const scoredRecipes = recipes.map((recipe: any) => {
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

// Generate AI Recipe
export const generateAIRecipe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      res.status(400).json({ success: false, error: 'A valid prompt string is required' });
      return;
    }

    const recipeData = await generateRecipeWithAI(prompt.trim());

    res.status(200).json({
      success: true,
      data: recipeData,
    });
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate recipe with AI' });
  }
};
