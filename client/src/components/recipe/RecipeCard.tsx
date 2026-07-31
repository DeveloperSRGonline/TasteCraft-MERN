import React from 'react';
import type { Recipe } from '../../types/recipe';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Heart, Edit2, Trash2, ListChecks, ChefHat, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface RecipeCardProps {
  recipe: Recipe;
  currentUserId: string;
  onView: (recipe: Recipe) => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
  onToggleLike: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  currentUserId,
  onView,
  onEdit,
  onDelete,
  onToggleLike,
}) => {
  const isLiked = recipe.likedBy?.includes(currentUserId);

  const getCategoryBadgeVariant = (category: string) => {
    switch (category.toLowerCase()) {
      case 'main dish':
        return 'primary';
      case 'street food':
      case 'desserts':
        return 'amber';
      case 'vegan':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="flex flex-col justify-between h-full bg-bg-surface/90 backdrop-blur-xs border-border-muted/60 hover:border-border-muted hover:bg-bg-surface transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-black/50 group p-5 rounded-2xl">
        <div className="flex flex-col gap-3">
          {/* Header row: category badge + actions */}
          <div className="flex items-center justify-between gap-2">
            <Badge variant={getCategoryBadgeVariant(recipe.category)}>
              {recipe.category}
            </Badge>

            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLike(recipe);
                }}
                className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs cursor-pointer ${
                  isLiked
                    ? 'text-accent-primary bg-accent-primary/10 hover:bg-accent-primary/20'
                    : 'text-text-body hover:text-text-heading hover:bg-bg-primary'
                }`}
                title={isLiked ? 'Unlike' : 'Like'}
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="font-medium">{recipe.likesCount || 0}</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-text-heading line-clamp-2 group-hover:text-accent-primary transition-colors">
            {recipe.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-text-body line-clamp-3 leading-relaxed">
            {recipe.description}
          </p>

          {/* Meta info */}
          <div className="flex items-center gap-3 text-xs text-text-body">
            <span className="flex items-center gap-1">
              <ListChecks className="w-3.5 h-3.5 text-accent-secondary" />
              {recipe.ingredients.length} ingredients
            </span>
            <span className="flex items-center gap-1">
              <ChefHat className="w-3.5 h-3.5 text-accent-secondary" />
              {recipe.steps.length} steps
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border-muted/40">
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 text-xs"
            onClick={() => onView(recipe)}
          >
            <Eye className="w-3.5 h-3.5 mr-1" /> View
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs"
            onClick={() => onEdit(recipe)}
          >
            <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="px-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={() => onDelete(recipe)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};