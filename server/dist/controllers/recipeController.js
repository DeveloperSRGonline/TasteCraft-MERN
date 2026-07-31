"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleLikeRecipe = exports.deleteRecipe = exports.updateRecipe = exports.createRecipe = exports.getRecipeById = exports.getRecipes = void 0;
const Recipe_js_1 = __importDefault(require("../models/Recipe.js"));
// Get recipes (filtered by userId, category, search)
const getRecipes = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'] || req.query.userId || '';
        const { search, category } = req.query;
        const query = {};
        // Enforce user scoping if userId is supplied
        if (userId) {
            query.userId = userId;
        }
        // Category filter
        if (category && category !== 'all' && category !== 'All') {
            query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }
        // Search filter
        if (search && typeof search === 'string' && search.trim() !== '') {
            const searchRegex = new RegExp(search.trim(), 'i');
            query.$or = [
                { title: searchRegex },
                { description: searchRegex },
                { category: searchRegex },
                { ingredients: searchRegex },
            ];
        }
        const recipes = await Recipe_js_1.default.find(query).sort({ createdAt: -1 });
        res.json(recipes);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching recipes', error: error.message });
    }
};
exports.getRecipes = getRecipes;
// Get single recipe by ID
const getRecipeById = async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await Recipe_js_1.default.findById(id);
        if (!recipe) {
            res.status(404).json({ message: 'Recipe not found' });
            return;
        }
        res.json(recipe);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching recipe', error: error.message });
    }
};
exports.getRecipeById = getRecipeById;
// Create new recipe
const createRecipe = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'] || req.body.userId || 'default_user';
        const { title, description, ingredients, steps, category } = req.body;
        if (!title || !description || !ingredients || !steps || !category) {
            res.status(400).json({ message: 'Please provide all required fields (title, description, ingredients, steps, category)' });
            return;
        }
        const formattedIngredients = Array.isArray(ingredients)
            ? ingredients.filter((i) => i.trim() !== '')
            : ingredients.split('\n').filter((i) => i.trim() !== '');
        const formattedSteps = Array.isArray(steps)
            ? steps.filter((s) => s.trim() !== '')
            : steps.split('\n').filter((s) => s.trim() !== '');
        const newRecipe = new Recipe_js_1.default({
            title,
            description,
            ingredients: formattedIngredients,
            steps: formattedSteps,
            category,
            userId,
            likesCount: 0,
            likedBy: [],
        });
        const savedRecipe = await newRecipe.save();
        res.status(201).json(savedRecipe);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating recipe', error: error.message });
    }
};
exports.createRecipe = createRecipe;
// Update recipe
const updateRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, ingredients, steps, category } = req.body;
        const recipe = await Recipe_js_1.default.findById(id);
        if (!recipe) {
            res.status(404).json({ message: 'Recipe not found' });
            return;
        }
        if (title)
            recipe.title = title;
        if (description)
            recipe.description = description;
        if (category)
            recipe.category = category;
        if (ingredients) {
            recipe.ingredients = Array.isArray(ingredients)
                ? ingredients.filter((i) => i.trim() !== '')
                : ingredients.split('\n').filter((i) => i.trim() !== '');
        }
        if (steps) {
            recipe.steps = Array.isArray(steps)
                ? steps.filter((s) => s.trim() !== '')
                : steps.split('\n').filter((s) => s.trim() !== '');
        }
        const updatedRecipe = await recipe.save();
        res.json(updatedRecipe);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating recipe', error: error.message });
    }
};
exports.updateRecipe = updateRecipe;
// Delete recipe
const deleteRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await Recipe_js_1.default.findByIdAndDelete(id);
        if (!recipe) {
            res.status(404).json({ message: 'Recipe not found' });
            return;
        }
        res.json({ message: 'Recipe deleted successfully', id });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting recipe', error: error.message });
    }
};
exports.deleteRecipe = deleteRecipe;
// Toggle like for recipe
const toggleLikeRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.headers['x-user-id'] || req.body.userId || 'default_user';
        const recipe = await Recipe_js_1.default.findById(id);
        if (!recipe) {
            res.status(404).json({ message: 'Recipe not found' });
            return;
        }
        const hasLiked = recipe.likedBy.includes(userId);
        if (hasLiked) {
            recipe.likedBy = recipe.likedBy.filter((uid) => uid !== userId);
            recipe.likesCount = Math.max(0, recipe.likesCount - 1);
        }
        else {
            recipe.likedBy.push(userId);
            recipe.likesCount += 1;
        }
        const updatedRecipe = await recipe.save();
        res.json(updatedRecipe);
    }
    catch (error) {
        res.status(500).json({ message: 'Error toggling like', error: error.message });
    }
};
exports.toggleLikeRecipe = toggleLikeRecipe;
