import React from 'react';
import type { Recipe } from '../../types/recipe';
import { RecipeCard } from '../recipe/RecipeCard';
import { Heart, Utensils } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FavoritesViewProps {
  recipes: Recipe[];
  currentUserId: string;
  onViewRecipe: (recipe: Recipe) => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (recipe: Recipe) => void;
  onToggleLike: (recipe: Recipe) => void;
  onSwitchToMyRecipes: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  recipes,
  currentUserId,
  onViewRecipe,
  onEditRecipe,
  onDeleteRecipe,
  onToggleLike,
  onSwitchToMyRecipes,
}) => {
  const favoriteRecipes = recipes.filter((r) => r.likedBy?.includes(currentUserId));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-extrabold text-text-heading flex items-center gap-2">
            <Heart className="w-5 h-5 text-accent-primary fill-accent-primary" />
            Favorite Recipes
          </h3>
          <p className="text-xs text-text-body mt-1">
            Recipes you have bookmarked or liked in your workspace.
          </p>
        </div>
        <span className="text-xs font-semibold text-text-body bg-bg-surface px-3 py-1 rounded-full border border-border-muted">
          {favoriteRecipes.length} Liked
        </span>
      </div>

      {favoriteRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {favoriteRecipes.map((recipe) => (
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
          <div className="p-4 bg-bg-primary rounded-full border border-border-muted text-accent-primary">
            <Heart className="w-8 h-8" />
          </div>
          <div className="max-w-md flex flex-col gap-1">
            <h4 className="text-lg font-bold text-text-heading">No Favorites Yet</h4>
            <p className="text-xs text-text-body">
              Click the heart icon on any recipe to add it to your favorite collection.
            </p>
          </div>
          <button
            onClick={onSwitchToMyRecipes}
            className="mt-2 text-xs font-semibold text-accent-secondary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Utensils className="w-4 h-4" /> Browse My Recipes
          </button>
        </motion.div>
      )}
    </div>
  );
};
