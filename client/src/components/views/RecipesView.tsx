import React from 'react';
import type { Recipe } from '../../types/recipe';
import { RecipeCard } from '../recipe/RecipeCard';
import { PillTab } from '../ui/PillTab';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Search, Plus, Utensils, Flame, Leaf, Cake, Coffee, Cookie, BookOpen, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RecipesViewProps {
  recipes: Recipe[];
  isLoading: boolean;
  currentUserId: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  onViewRecipe: (recipe: Recipe) => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (recipe: Recipe) => void;
  onToggleLike: (recipe: Recipe) => void;
  onOpenCreateModal: () => void;
}

export const RecipesView: React.FC<RecipesViewProps> = ({
  recipes,
  isLoading,
  currentUserId,
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  onViewRecipe,
  onEditRecipe,
  onDeleteRecipe,
  onToggleLike,
  onOpenCreateModal,
}) => {
  const categoryTabs = [
    { id: 'All', label: 'All Recipes', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'Main Dish', label: 'Main Dish', icon: <Utensils className="w-4 h-4" /> },
    { id: 'Street Food', label: 'Street Food', icon: <Flame className="w-4 h-4" /> },
    { id: 'Vegan', label: 'Vegan', icon: <Leaf className="w-4 h-4" /> },
    { id: 'Desserts', label: 'Desserts', icon: <Cake className="w-4 h-4" /> },
    { id: 'Breakfast', label: 'Breakfast', icon: <Coffee className="w-4 h-4" /> },
    { id: 'Snacks', label: 'Snacks', icon: <Cookie className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Category Pills & Search Controls */}
      <div className="flex flex-col gap-4 bg-bg-surface p-5 rounded-2xl border border-border-muted/60 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="w-full sm:w-96 relative">
            <Input
              placeholder="Search recipes, ingredients, categories..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-body hover:text-text-heading transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-border-muted/40">
          <PillTab tabs={categoryTabs} activeTab={activeCategory} onChange={onCategoryChange} />
        </div>
      </div>

      {/* Header Info */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-text-heading flex items-center gap-2">
          <span>Recipes Grid</span>
          <span className="text-xs font-normal text-text-body bg-bg-surface px-2.5 py-0.5 rounded-full border border-border-muted">
            {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
          </span>
        </h3>
      </div>

      {/* Grid or Skeleton / Empty */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-64 bg-bg-surface/50 border border-border-muted/50 rounded-2xl animate-pulse p-6 flex flex-col justify-between"
            >
              <div className="flex flex-col gap-3">
                <div className="w-20 h-5 bg-border-muted/40 rounded-full" />
                <div className="w-3/4 h-6 bg-border-muted/40 rounded-md" />
                <div className="w-full h-12 bg-border-muted/30 rounded-md" />
              </div>
              <div className="w-full h-9 bg-border-muted/40 rounded-xl" />
            </div>
          ))}
        </div>
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                currentUserId={currentUserId}
                onView={onViewRecipe}
                onEdit={onEditRecipe}
                onDelete={onDeleteRecipe}
                onToggleLike={onToggleLike}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center p-12 text-center bg-bg-surface/60 border border-dashed border-border-muted rounded-3xl gap-4 my-4"
        >
          <div className="p-4 bg-bg-primary rounded-full border border-border-muted text-accent-secondary">
            <Utensils className="w-8 h-8" />
          </div>
          <div className="max-w-md flex flex-col gap-1">
            <h4 className="text-lg font-bold text-text-heading">No Recipes Found</h4>
            <p className="text-xs text-text-body">
              {searchQuery || activeCategory !== 'All'
                ? `No recipes match "${searchQuery || activeCategory}". Try clearing search filters.`
                : 'No recipes added yet. Click below to add your first recipe!'}
            </p>
          </div>
          <div className="flex gap-3 mt-2">
            {(searchQuery || activeCategory !== 'All') && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  onSearchChange('');
                  onCategoryChange('All');
                }}
              >
                Clear Filters
              </Button>
            )}
            <Button variant="primary" size="sm" onClick={onOpenCreateModal} className="gap-2">
              <Plus className="w-4 h-4" /> Create Recipe
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
