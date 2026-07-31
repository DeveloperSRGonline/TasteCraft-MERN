import React from 'react';
import type { Recipe } from '../../types/recipe';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Utensils, Flame, Leaf, Cake, Coffee, Cookie, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategoriesViewProps {
  recipes: Recipe[];
  onSelectCategory: (category: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  recipes,
  onSelectCategory,
}) => {
  const categoryDefs = [
    {
      id: 'Main Dish',
      label: 'Main Dish',
      description: 'Substantial gourmet entrées, pastas, steaks & rich curries.',
      icon: <Utensils className="w-6 h-6 text-accent-primary" />,
      badge: 'primary' as const,
    },
    {
      id: 'Street Food',
      label: 'Street Food',
      description: 'Bold burgers, tacos, crispy finger foods & quick savory bites.',
      icon: <Flame className="w-6 h-6 text-accent-secondary" />,
      badge: 'amber' as const,
    },
    {
      id: 'Vegan',
      label: 'Vegan',
      description: 'Plant-powered salads, tartines, bowls & wholesome greens.',
      icon: <Leaf className="w-6 h-6 text-emerald-400" />,
      badge: 'secondary' as const,
    },
    {
      id: 'Desserts',
      label: 'Desserts',
      description: 'Molten lava cakes, artisanal pastries, tarts & sweet treats.',
      icon: <Cake className="w-6 h-6 text-pink-400" />,
      badge: 'amber' as const,
    },
    {
      id: 'Breakfast',
      label: 'Breakfast',
      description: 'Pancakes, poached egg toasts, acai bowls & morning brews.',
      icon: <Coffee className="w-6 h-6 text-amber-400" />,
      badge: 'secondary' as const,
    },
    {
      id: 'Snacks',
      label: 'Snacks',
      description: 'Quick bites, baked chips, dips & savory nibbles.',
      icon: <Cookie className="w-6 h-6 text-orange-400" />,
      badge: 'secondary' as const,
    },
  ];

  const getCount = (catId: string) => {
    return recipes.filter((r) => r.category.toLowerCase() === catId.toLowerCase()).length;
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-xl font-extrabold text-text-heading">Recipe Categories</h3>
        <p className="text-xs text-text-body mt-1">
          Explore your recipe collections organized by culinary style.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryDefs.map((cat, index) => {
          const count = getCount(cat.id);
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              onClick={() => onSelectCategory(cat.id)}
              className="cursor-pointer"
            >
              <Card className="p-6 bg-bg-surface border-border-muted/60 hover:border-border-muted hover:bg-bg-surface/90 transition-all shadow-xl hover:shadow-2xl flex flex-col justify-between h-48 group">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-bg-primary rounded-2xl border border-border-muted/50">
                      {cat.icon}
                    </div>
                    <Badge variant={cat.badge}>{count} {count === 1 ? 'Recipe' : 'Recipes'}</Badge>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-text-heading group-hover:text-accent-secondary transition-colors">
                      {cat.label}
                    </h4>
                    <p className="text-xs text-text-body mt-1 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-text-body group-hover:text-text-heading transition-colors font-medium">
                  <span>Browse {cat.label}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
