import React from 'react';
import type { Recipe } from '../../types/recipe';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Heart, Edit2, Trash2, ListChecks, ChefHat, CheckCircle2 } from 'lucide-react';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  currentUserId: string;
  onClose: () => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
  onToggleLike: (recipe: Recipe) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  isOpen,
  currentUserId,
  onClose,
  onEdit,
  onDelete,
  onToggleLike,
}) => {
  if (!recipe) return null;

  const isLiked = recipe.likedBy?.includes(currentUserId);
  const [activeTab, setActiveTab] = React.useState<'ingredients' | 'steps'>('ingredients');

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
    <Modal isOpen={isOpen} onClose={onClose} title={recipe.title}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Badge variant={getCategoryBadgeVariant(recipe.category)} className="mb-3">
              {recipe.category}
            </Badge>
            <p className="text-sm text-text-body leading-relaxed">{recipe.description}</p>
          </div>
          <button
            onClick={() => onToggleLike(recipe)}
            className={`p-2 rounded-lg transition-all ${
              isLiked
                ? 'text-accent-primary bg-accent-primary/10'
                : 'text-text-body hover:text-text-heading hover:bg-bg-primary'
            }`}
            title={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-border-muted/40">
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`pb-2 px-4 text-sm font-medium transition-all relative ${
              activeTab === 'ingredients'
                ? 'text-accent-primary'
                : 'text-text-body hover:text-text-heading'
            }`}
          >
            <ListChecks className="w-4 h-4 inline mr-1" />
            Ingredients ({Array.isArray(recipe.ingredients) ? recipe.ingredients.length : 0})
            {activeTab === 'ingredients' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`pb-2 px-4 text-sm font-medium transition-all relative ${
              activeTab === 'steps'
                ? 'text-accent-primary'
                : 'text-text-body hover:text-text-heading'
            }`}
          >
            <ChefHat className="w-4 h-4 inline mr-1" />
            Steps ({Array.isArray(recipe.steps) ? recipe.steps.length : 0})
            {activeTab === 'steps' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'ingredients' ? (
          <div className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => {
              const ingredientText = typeof ingredient === 'string' 
                ? ingredient 
                : `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-bg-primary/50 border border-border-muted/30"
                >
                  <CheckCircle2 className="w-4 h-4 text-accent-secondary shrink-0" />
                  <span className="text-sm text-text-body">{ingredientText}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {recipe.steps.map((step, index) => {
              const stepText = typeof step === 'string' ? step : step.instruction;
              const stepNumber = typeof step === 'string' ? index + 1 : step.stepNumber;
              return (
                <div
                  key={index}
                  className="flex gap-3 p-3 rounded-lg bg-bg-primary/50 border border-border-muted/30"
                >
                  <div className="shrink-0 w-6 h-6 rounded-full bg-accent-primary/20 text-accent-primary text-xs font-bold flex items-center justify-center">
                    {stepNumber}
                  </div>
                  <p className="text-sm text-text-body leading-relaxed">{stepText}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-border-muted/40">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              onEdit(recipe);
              onClose();
            }}
          >
            <Edit2 className="w-4 h-4 mr-2" /> Edit Recipe
          </Button>
          <Button
            variant="ghost"
            className="flex-1 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={() => {
              onDelete(recipe);
              onClose();
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};