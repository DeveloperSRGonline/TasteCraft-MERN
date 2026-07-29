import React, { useState } from 'react';
import type { Recipe } from '../../types/recipe';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Heart, ShoppingBag, Star, UserPlus, UserCheck, Flame } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect?: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(recipe.stats.likesCount || 0);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFollowing((prev) => !prev);
  };

  return (
    <Card
      onClick={() => onSelect && onSelect(recipe)}
      className="group relative flex flex-col overflow-hidden bg-[--bg-surface] border border-[--border-muted]/40 hover:border-[--accent-primary]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[--accent-primary]/5"
    >
      {/* Header / Media Section */}
      <div className="relative h-52 w-full overflow-hidden bg-zinc-900">
        <img
          src={recipe.steps[0]?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
          alt={recipe.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[--bg-surface] via-transparent to-black/40" />

        {/* Top Badges & Actions */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
          <Badge variant="secondary" className="backdrop-blur-md bg-black/60 text-white font-medium border border-white/10">
            {recipe.category}
          </Badge>

          <button
            onClick={handleLikeToggle}
            className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
              isLiked
                ? 'bg-[--accent-primary] text-white shadow-lg shadow-[--accent-primary]/40'
                : 'bg-black/50 text-white/80 hover:bg-black/70 hover:text-white'
            }`}
            aria-label="Like recipe"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Price tag badge if orderable */}
        {recipe.pricing.isOrderable && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="px-3 py-1 rounded-full bg-[--accent-primary] text-white font-bold text-sm shadow-md flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5" />
              ${recipe.pricing.price.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Author info */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <img
                src={recipe.author.profilePic || `https://api.dicebear.com/7.x/bottts/svg?seed=${recipe.author.username}`}
                alt={recipe.author.username}
                className="w-6 h-6 rounded-full border border-[--border-muted]"
              />
              <span className="text-xs text-[--text-body] font-medium hover:text-white transition-colors">
                @{recipe.author.username}
              </span>
            </div>

            <button
              onClick={handleFollowToggle}
              className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                isFollowing
                  ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  : 'bg-[--accent-primary-2]/20 text-[--accent-primary-2] hover:bg-[--accent-primary-2]/30'
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-3 h-3" /> Following
                </>
              ) : (
                <>
                  <UserPlus className="w-3 h-3" /> Follow
                </>
              )}
            </button>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-[--text-heading] line-clamp-1 group-hover:text-[--accent-primary] transition-colors">
            {recipe.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-[--text-body] mt-1 line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Stats Footer */}
        <div className="mt-4 pt-3 border-t border-[--border-muted]/30 flex items-center justify-between text-xs text-[--text-body]">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1 text-[--accent-secondary]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-semibold text-white">{recipe.stats.averageRating.toFixed(1)}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Heart className="w-3.5 h-3.5 text-zinc-500" />
              <span>{likesCount}</span>
            </span>
          </div>

          <div className="flex items-center space-x-2 text-zinc-500">
            {recipe.pricing.isOrderable && (
              <span className="flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>{recipe.stats.ordersCount} orders</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
