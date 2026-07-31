import React, { useState, useEffect, useRef } from 'react';
import type { Recipe } from '../../types/recipe';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Utensils, Heart, ListChecks, CornerDownLeft, Sparkles } from 'lucide-react';

interface SpotlightSearchModalProps {
  isOpen: boolean;
  recipes: Recipe[];
  onClose: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const SpotlightSearchModal: React.FC<SpotlightSearchModalProps> = ({
  isOpen,
  recipes,
  onClose,
  onSelectRecipe,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const isQueryEmpty = !query.trim();

  // Filter recipes ONLY when query is entered
  const filteredRecipes = isQueryEmpty
    ? []
    : recipes.filter((r) => {
        const q = query.toLowerCase().trim();
        return (
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.ingredients.some((ing) => {
            const ingName = typeof ing === 'string' ? ing : ing.name;
            return ingName.toLowerCase().includes(q);
          })
        );
      });

  // Handle keyboard navigation (Up, Down, Enter, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (filteredRecipes.length > 0) {
          setSelectedIndex((prev) => (prev < filteredRecipes.length - 1 ? prev + 1 : 0));
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (filteredRecipes.length > 0) {
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredRecipes.length - 1));
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredRecipes[selectedIndex]) {
          onSelectRecipe(filteredRecipes[selectedIndex]);
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredRecipes, selectedIndex, onSelectRecipe, onClose]);

  if (!isOpen) return null;

  const quickSearchTags = ['Truffle', 'Burger', 'Vegan', 'Pasta', 'Desserts'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Spotlight Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: 'spring', duration: 0.25 }}
          className="relative w-full max-w-2xl bg-bg-surface border border-border-muted/80 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col"
        >
          {/* Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-border-muted/60 bg-bg-primary/50">
            <Search className="w-5 h-5 text-accent-primary shrink-0 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Type to search recipes, ingredients, categories..."
              className="w-full bg-transparent text-text-heading placeholder-text-body/50 text-base outline-none"
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-text-body bg-bg-primary border border-border-muted rounded-md shrink-0">
              ESC
            </kbd>
          </div>

          {/* Results or Empty Search Prompt */}
          <div className="max-h-96 overflow-y-auto p-2 flex flex-col gap-1 min-h-[160px]">
            {isQueryEmpty ? (
              /* Initial State (Query is empty) */
              <div className="p-8 flex flex-col items-center justify-center text-center gap-4 my-auto">
                <div className="p-3 bg-bg-primary rounded-2xl border border-border-muted/60 text-accent-secondary">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-bold text-text-heading">Spotlight Recipe Search</h4>
                  <p className="text-xs text-text-body">
                    Start typing to search recipes by title, ingredients, or category.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                  <span className="text-[11px] text-text-body mr-1">Suggestions:</span>
                  {quickSearchTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-2.5 py-1 text-xs bg-bg-primary hover:bg-border-muted/50 border border-border-muted/60 rounded-lg text-text-body hover:text-text-heading transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : filteredRecipes.length > 0 ? (
              /* Matching Search Results */
              filteredRecipes.map((recipe, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={recipe._id}
                    onClick={() => {
                      onSelectRecipe(recipe);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-bg-primary border border-border-muted text-text-heading'
                        : 'text-text-body hover:bg-bg-primary/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected
                            ? 'bg-accent-primary/20 text-accent-primary'
                            : 'bg-bg-primary text-text-body'
                        }`}
                      >
                        <Utensils className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-text-heading">
                            {recipe.title}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-border-muted/40 text-accent-secondary font-medium">
                            {recipe.category}
                          </span>
                        </div>
                        <span className="text-xs text-text-body line-clamp-1 mt-0.5">
                          {recipe.description}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs shrink-0">
                      <span className="hidden sm:flex items-center gap-1 text-text-body">
                        <ListChecks className="w-3.5 h-3.5 text-accent-secondary" />
                        {recipe.ingredients.length} ing.
                      </span>
                      <span className="flex items-center gap-1 text-text-body">
                        <Heart className="w-3.5 h-3.5 text-accent-primary" />
                        {recipe.likesCount || 0}
                      </span>
                      {isSelected && <CornerDownLeft className="w-4 h-4 text-accent-primary" />}
                    </div>
                  </div>
                );
              })
            ) : (
              /* No Search Match State */
              <div className="p-8 text-center text-xs text-text-body flex flex-col items-center gap-2 my-auto">
                <Search className="w-8 h-8 text-border-muted" />
                <p>No recipes found matching "{query}"</p>
              </div>
            )}
          </div>

          {/* Footer Shortcuts hint */}
          <div className="px-4 py-2.5 bg-bg-primary/80 border-t border-border-muted/50 flex items-center justify-between text-[11px] text-text-body">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-bg-surface border border-border-muted rounded">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-bg-surface border border-border-muted rounded">↓</kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-bg-surface border border-border-muted rounded">↵</kbd>
                to select
              </span>
            </div>
            <span>
              {isQueryEmpty
                ? `${recipes.length} total recipes`
                : `${filteredRecipes.length} results`}
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
