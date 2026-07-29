import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { PortionSelector } from './RecipePortionSelector';
import type { Recipe, PortionSize } from '../../types/recipe';
import { Heart, Star, ShoppingBag, UserCheck, UserPlus, Check, Sparkles } from 'lucide-react';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ recipe, isOpen, onClose }) => {
  if (!recipe) return null;

  const [selectedPortion, setSelectedPortion] = useState<PortionSize>(
    recipe.pricing.portionSizes[0] || { label: 'Standard', priceOffset: 0 }
  );
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps'>('ingredients');

  const basePrice = recipe.pricing.price || 0;
  const addonTotal = recipe.mealAddons
    .filter((addon) => selectedAddons.includes(addon.name))
    .reduce((sum, addon) => sum + addon.price, 0);
  const totalPrice = basePrice + selectedPortion.priceOffset + addonTotal;

  const toggleAddon = (addonName: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonName) ? prev.filter((name) => name !== addonName) : [...prev, addonName]
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="-mt-6 -mx-6">
        {/* Banner Media */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-zinc-900">
          <img
            src={recipe.steps[0]?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80'}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[--bg-surface] via-[--bg-surface]/50 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-semibold">
              {recipe.category}
            </span>
          </div>
        </div>

        {/* Content Container */}
        <div className="px-6 pb-6 pt-2 space-y-6">
          {/* Header & Author Info */}
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white">{recipe.title}</h2>
                <div className="flex items-center space-x-3 mt-2">
                  <div className="flex items-center space-x-2">
                    <img
                      src={recipe.author.profilePic || `https://api.dicebear.com/7.x/bottts/svg?seed=${recipe.author.username}`}
                      alt={recipe.author.username}
                      className="w-7 h-7 rounded-full border border-[--border-muted]"
                    />
                    <span className="text-sm font-medium text-zinc-300">@{recipe.author.username}</span>
                  </div>
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
                      isFollowing
                        ? 'bg-zinc-800 text-zinc-400'
                        : 'bg-[--accent-primary-2]/20 text-[--accent-primary-2] hover:bg-[--accent-primary-2]/30'
                    }`}
                  >
                    {isFollowing ? <UserCheck className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>

              {/* Rating & Likes */}
              <div className="flex items-center space-x-4 bg-zinc-900/80 px-3 py-1.5 rounded-xl border border-[--border-muted]/30">
                <div className="flex items-center space-x-1 text-[--accent-secondary]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-white text-sm">{recipe.stats.averageRating.toFixed(1)}</span>
                </div>
                <div className="h-4 w-[1px] bg-zinc-700" />
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                    isLiked ? 'text-[--accent-primary]' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{recipe.stats.likesCount + (isLiked ? 1 : 0)}</span>
                </button>
              </div>
            </div>

            <p className="text-sm text-[--text-body] mt-3 leading-relaxed">{recipe.description}</p>
          </div>

          {/* Tab Selection (Ingredients vs Instructions) */}
          <div className="flex space-x-4 border-b border-[--border-muted]/40">
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`pb-2.5 text-sm font-semibold transition-all relative ${
                activeTab === 'ingredients' ? 'text-[--accent-primary]' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Ingredients ({recipe.ingredients.length})
              {activeTab === 'ingredients' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[--accent-primary] rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('steps')}
              className={`pb-2.5 text-sm font-semibold transition-all relative ${
                activeTab === 'steps' ? 'text-[--accent-primary]' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Instructions ({recipe.steps.length} steps)
              {activeTab === 'steps' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[--accent-primary] rounded-full" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'ingredients' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recipe.ingredients.map((ing, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/60 text-sm"
                >
                  <span className="text-zinc-200 font-medium">{ing.name}</span>
                  <span className="text-zinc-400 text-xs font-mono">
                    {ing.quantity} {ing.unit} {ing.isOptional && <span className="text-zinc-500">(Optional)</span>}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recipe.steps.map((step) => (
                <div key={step.stepNumber} className="flex gap-4 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[--accent-primary-2]/20 text-[--accent-primary-2] font-bold text-xs flex items-center justify-center">
                    {step.stepNumber}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-zinc-200 leading-relaxed">{step.instruction}</p>
                    {step.image && (
                      <img
                        src={step.image}
                        alt={`Step ${step.stepNumber}`}
                        className="w-full max-h-48 object-cover rounded-lg border border-zinc-800"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Gourmet Order Builder (if Orderable) */}
          {recipe.pricing.isOrderable && (
            <div className="p-4 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-900/90 border border-[--accent-primary]/30 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[--accent-primary]" />
                  Order Fresh Gourmet Meal
                </h4>
                <span className="text-xs text-zinc-400">Direct from Creator</span>
              </div>

              {/* Portion Selector */}
              {recipe.pricing.portionSizes.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                    Select Portion Size
                  </label>
                  <PortionSelector
                    portions={recipe.pricing.portionSizes}
                    selectedPortion={selectedPortion}
                    onSelectPortion={(p: PortionSize) => setSelectedPortion(p)}
                  />
                </div>
              )}

              {/* Addons Builder */}
              {recipe.mealAddons.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                    Customize Addons
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {recipe.mealAddons.map((addon) => {
                      const isSelected = selectedAddons.includes(addon.name);
                      return (
                        <button
                          key={addon.name}
                          type="button"
                          onClick={() => toggleAddon(addon.name)}
                          className={`p-2.5 rounded-xl border text-left flex items-center space-x-2.5 transition-all ${
                            isSelected
                              ? 'bg-[--accent-primary]/15 border-[--accent-primary] text-white shadow-md'
                              : 'bg-zinc-800/40 border-zinc-700/50 text-zinc-400 hover:border-zinc-500'
                          }`}
                        >
                          <img src={addon.iconUrl} alt={addon.name} className="w-8 h-8 rounded-md object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{addon.name}</p>
                            <p className="text-[10px] text-[--accent-secondary] font-mono">+${addon.price.toFixed(2)}</p>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[--accent-primary] flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Total & Action Button */}
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-400 block">Total Meal Price</span>
                  <span className="text-xl font-black text-white">${totalPrice.toFixed(2)}</span>
                </div>
                <Button variant="primary" className="px-6 py-2.5 shadow-lg shadow-[--accent-primary]/30 font-bold">
                  <ShoppingBag className="w-4 h-4 mr-2" /> Add to Gourmet Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
