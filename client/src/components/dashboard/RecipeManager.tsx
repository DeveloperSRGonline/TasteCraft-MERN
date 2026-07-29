import React from 'react';
import type { TopRecipeItem } from '../../types/dashboard';
import { ToggleLeft, ToggleRight, Heart, ShoppingBag, Star, Edit, Trash2 } from 'lucide-react';

interface RecipeManagerProps {
  recipes: TopRecipeItem[];
  onToggleOrderable: (recipeId: string) => void;
  isLoading?: boolean;
}

export const RecipeManager: React.FC<RecipeManagerProps> = ({ recipes, onToggleOrderable, isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-muted)]/30 text-center text-[var(--text-body)] animate-pulse">
        Loading recipe inventory...
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-muted)]/30 overflow-hidden shadow-xl">
      <div className="p-5 border-b border-[var(--border-muted)]/30 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[var(--text-heading)]">Content & Orderable Management</h3>
          <p className="text-xs text-[var(--text-body)]">Manage availability, view engagement, edit or archive creations</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-black/40 text-[var(--text-body)] uppercase tracking-wider font-semibold border-b border-white/5">
            <tr>
              <th className="py-3.5 px-6">Recipe</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Base Price</th>
              <th className="py-3.5 px-4">Stats</th>
              <th className="py-3.5 px-4">Orderable</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-gray-200 font-medium">
            {recipes.map((recipe) => (
              <tr key={recipe.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-6">
                  <div className="font-bold text-white text-sm">{recipe.title}</div>
                </td>
                <td className="py-4 px-4 text-gray-400">
                  <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                    {recipe.category}
                  </span>
                </td>
                <td className="py-4 px-4 font-bold text-[var(--accent-secondary)]">
                  ${recipe.price.toFixed(2)}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3 text-xs text-gray-400">
                    <span className="flex items-center space-x-1" title="Likes">
                      <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
                      <span>{recipe.likesCount}</span>
                    </span>
                    <span className="flex items-center space-x-1" title="Orders">
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                      <span>{recipe.ordersCount}</span>
                    </span>
                    <span className="flex items-center space-x-1" title="Rating">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400/20" />
                      <span>{recipe.averageRating > 0 ? recipe.averageRating.toFixed(1) : 'N/A'}</span>
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => onToggleOrderable(recipe.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      recipe.isOrderable
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                        : 'bg-gray-500/10 border-gray-500/30 text-gray-400 hover:bg-gray-500/20'
                    }`}
                  >
                    {recipe.isOrderable ? (
                      <>
                        <ToggleRight className="w-4 h-4 text-emerald-400" />
                        <span>Orderable</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4 text-gray-400" />
                        <span>Disabled</span>
                      </>
                    )}
                  </button>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                      recipe.status === 'published'
                        ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
                        : recipe.status === 'draft'
                        ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                        : 'bg-rose-400/10 text-rose-400 border border-rose-400/20'
                    }`}
                  >
                    {recipe.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right space-x-2">
                  <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
