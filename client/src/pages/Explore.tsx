import React, { useState, useEffect, useRef } from 'react';
import { useRecipeStore } from '../store/recipeStore';
import { useDebounce } from '../hooks/useDebounce';
import type { Recipe } from '../types/recipe';
import { RecipeCard } from '../components/recipe/RecipeCard';
import { RecipeDetailModal } from '../components/recipe/RecipeDetailModal';
import { CreateRecipeModal } from '../components/recipe/CreateRecipeModal';
import { CartDrawer } from '../components/cart/CartDrawer';
import { PillTab } from '../components/ui/PillTab';
import { Button } from '../components/ui/Button';
import {
  Search,
  PlusCircle,
  ShoppingBag,
  Utensils,
  ChefHat,
} from 'lucide-react';
import { UserButton, useUser, SignInButton } from '@clerk/react';

const CATEGORIES = ['All', 'Main Dish', 'Vegan', 'Street Food', 'Desserts', 'Beverages'];

const MOCK_RECIPES: Recipe[] = [
  {
    _id: '1',
    title: 'Truffle & Smoked Garlic Tagliatelle',
    description: 'Silky handmade pasta tossed in aged truffle butter, roasted garlic confit, and shaved parmesan reggiano.',
    category: 'Main Dish',
    tags: ['Gourmet', 'Pasta', 'Italian'],
    ingredients: [
      { name: 'Tagliatelle Pasta', quantity: 250, unit: 'g', isOptional: false },
      { name: 'Black Truffle Oil', quantity: 15, unit: 'ml', isOptional: false },
      { name: 'Heavy Cream', quantity: 100, unit: 'ml', isOptional: false },
      { name: 'Parmesan', quantity: 40, unit: 'g', isOptional: false },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Cook pasta in heavily salted boiling water until al dente.',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      },
      {
        stepNumber: 2,
        instruction: 'Gently simmer heavy cream and truffle oil, then emulsify with pasta water.',
      },
    ],
    pricing: {
      isOrderable: true,
      price: 24.50,
      portionSizes: [
        { label: 'Standard (380g)', priceOffset: 0 },
        { label: 'Large (480g)', priceOffset: 4.5 },
      ],
    },
    mealAddons: [
      { name: 'Extra Truffle Oil', price: 3.5, iconUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=150&q=80' },
      { name: 'Garlic Ciabatta', price: 4.0, iconUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=150&q=80' },
    ],
    author: {
      _id: 'u1',
      username: 'chef_marco',
      profilePic: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80',
      bio: 'Michelin-starred Italian artisan chef.',
    },
    stats: { likesCount: 412, ordersCount: 189, averageRating: 4.9 },
    status: 'published',
    createdAt: '2026-07-28T10:00:00Z',
    updatedAt: '2026-07-28T10:00:00Z',
  },
  {
    _id: '2',
    title: 'Smoked Wagyu Gourmet Slider Set',
    description: 'Triple-seared A5 Wagyu beef patties, melted sharp cheddar, caramelized onions, and house secret burger sauce.',
    category: 'Street Food',
    tags: ['Wagyu', 'Burger', 'Gourmet'],
    ingredients: [
      { name: 'A5 Wagyu Beef', quantity: 300, unit: 'g', isOptional: false },
      { name: 'Brioche Buns', quantity: 3, unit: 'pcs', isOptional: false },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Sear Wagyu patties on smoking cast iron skillet for 90 seconds per side.',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      },
    ],
    pricing: {
      isOrderable: true,
      price: 28.00,
      portionSizes: [
        { label: '3 Sliders', priceOffset: 0 },
        { label: '5 Sliders', priceOffset: 8.0 },
      ],
    },
    mealAddons: [
      { name: 'Truffle Fries', price: 5.5, iconUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=150&q=80' },
    ],
    author: {
      _id: 'u2',
      username: 'artisan_burger_co',
      profilePic: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=200&q=80',
    },
    stats: { likesCount: 890, ordersCount: 342, averageRating: 4.8 },
    status: 'published',
    createdAt: '2026-07-29T14:00:00Z',
    updatedAt: '2026-07-29T14:00:00Z',
  },
  {
    _id: '3',
    title: 'Velvety Matcha Avocado Glow Bowl',
    description: 'Nutrient-rich bowl with ceremonial grade Kyoto matcha, organic avocado cream, kiwi, chia seeds, and coconut flakes.',
    category: 'Vegan',
    tags: ['Healthy', 'Vegan', 'Superfood'],
    ingredients: [
      { name: 'Kyoto Matcha Powder', quantity: 10, unit: 'g', isOptional: false },
      { name: 'RIPE Hass Avocado', quantity: 1, unit: 'pc', isOptional: false },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Blend frozen banana, avocado, matcha powder, and coconut milk until silky smooth.',
        image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80',
      },
    ],
    pricing: {
      isOrderable: true,
      price: 16.50,
      portionSizes: [{ label: 'Standard Bowl', priceOffset: 0 }],
    },
    mealAddons: [
      { name: 'Organic Chia Seeds', price: 2.0, iconUrl: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=150&q=80' },
    ],
    author: {
      _id: 'u3',
      username: 'botanical_kitchen',
      profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    stats: { likesCount: 310, ordersCount: 94, averageRating: 4.9 },
    status: 'published',
    createdAt: '2026-07-27T08:00:00Z',
    updatedAt: '2026-07-27T08:00:00Z',
  },
];

export const Explore: React.FC = () => {
  const { user, isSignedIn } = useUser();
  const { activeTab, searchQuery, selectedCategory, setActiveTab, setSearchQuery, setSelectedCategory } =
    useRecipeStore();

  const debouncedSearch = useDebounce(searchQuery, 300);

  // UI state
  const [recipes, setRecipes] = useState<Recipe[]>(MOCK_RECIPES);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Infinite Scroll State
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Filter recipes based on tab, category, and debounced search
  const filteredRecipes = recipes.filter((recipe) => {
    // Tab filtering
    if (activeTab === 'my-recipes') {
      if (user && recipe.author.username !== user.username) return false;
    }

    // Category filtering
    if (selectedCategory !== 'All' && recipe.category !== selectedCategory) {
      return false;
    }

    // Search query filtering
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      const matchTitle = recipe.title.toLowerCase().includes(q);
      const matchCategory = recipe.category.toLowerCase().includes(q);
      const matchIngredient = recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(q));
      return matchTitle || matchCategory || matchIngredient;
    }

    return true;
  });

  // Intersection Observer for Infinite Scroll simulation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredRecipes.length) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + 4);
            setIsLoadingMore(false);
          }, 800);
        }
      },
      { threshold: 0.5 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [visibleCount, filteredRecipes.length]);

  const handleOpenDetail = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsDetailOpen(true);
  };

  const handleRecipeCreated = (newRecipeData: Partial<Recipe>) => {
    const created: Recipe = {
      _id: Date.now().toString(),
      title: newRecipeData.title || 'Untitled Creation',
      description: newRecipeData.description || '',
      category: newRecipeData.category || 'Main Dish',
      tags: ['New'],
      ingredients: [],
      steps: [{ stepNumber: 1, instruction: 'Enjoy your custom gourmet creation!' }],
      pricing: newRecipeData.pricing || { isOrderable: false, price: 0, portionSizes: [] },
      mealAddons: [],
      author: {
        _id: user?.id || 'u-current',
        username: user?.username || user?.firstName || 'you',
        profilePic: user?.imageUrl,
      },
      stats: { likesCount: 0, ordersCount: 0, averageRating: 5.0 },
      status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRecipes((prev) => [created, ...prev]);
  };

  const pillTabs = [
    { id: 'explore', label: 'Explore Feed' },
    { id: 'my-recipes', label: 'My Recipes' },
  ];

  return (
    <div className="min-h-screen bg-[--bg-primary] text-white flex flex-col">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[--bg-primary]/80 border-b border-[--border-muted]/40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[--accent-primary] to-[--accent-primary-2] flex items-center justify-center shadow-lg shadow-[--accent-primary]/20">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            TasteCraft
          </span>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search titles, ingredients, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[--accent-primary] transition-all"
          />
        </div>

        {/* Action Controls & User Auth */}
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setIsCreateOpen(true)}
            variant="primary"
            className="hidden sm:flex items-center space-x-1.5 text-xs py-2 px-4 shadow-md shadow-[--accent-primary]/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Recipe</span>
          </Button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[--accent-primary] text-[10px] font-bold text-white flex items-center justify-center">
              1
            </span>
          </button>

          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <Button variant="outline" className="text-xs py-1.5">
                Sign In
              </Button>
            </SignInButton>
          )}
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Top Control Bar: Tab Switcher & Action */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[--border-muted]/30 pb-4">
          <PillTab
            tabs={pillTabs}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as 'explore' | 'my-recipes')}
          />

          {/* Category Filter Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-zinc-800 text-white border border-[--accent-primary]'
                    : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800/80 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-white"
          />
        </div>

        {/* Recipe Grid Feed */}
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 space-y-3">
            <ChefHat className="w-12 h-12 text-zinc-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No recipes found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Try adjusting your search criteria or category filter, or create a brand new recipe!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.slice(0, visibleCount).map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} onSelect={handleOpenDetail} />
            ))}
          </div>
        )}

        {/* Intersection Observer Infinite Scroll Trigger */}
        {visibleCount < filteredRecipes.length && (
          <div ref={loaderRef} className="py-8 flex justify-center items-center">
            {isLoadingMore ? (
              <div className="flex items-center space-x-2 text-xs text-[--accent-primary] font-semibold">
                <div className="w-4 h-4 border-2 border-[--accent-primary] border-t-transparent rounded-full animate-spin" />
                <span>Fetching more culinary delights...</span>
              </div>
            ) : (
              <span className="text-xs text-zinc-500">Scroll for more recipes...</span>
            )}
          </div>
        )}
      </main>

      {/* Modals & Drawers */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
      <CreateRecipeModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onRecipeCreated={handleRecipeCreated}
      />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};
