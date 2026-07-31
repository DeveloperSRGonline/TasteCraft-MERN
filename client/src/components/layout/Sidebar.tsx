import React from 'react';
import { Flame, BookOpen, Tag, Heart, Plus, ChefHat } from 'lucide-react';

export type ActiveView = 'my-recipes' | 'categories' | 'favorites';

interface SidebarProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  onOpenCreateModal: () => void;
  recipeCount: number;
  likedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onViewChange,
  onOpenCreateModal,
  recipeCount,
  likedCount,
}) => {
  const navItems = [
    {
      id: 'my-recipes' as ActiveView,
      label: 'My Recipes',
      icon: <BookOpen className="w-4 h-4" />,
      badge: recipeCount,
    },
    {
      id: 'categories' as ActiveView,
      label: 'Categories',
      icon: <Tag className="w-4 h-4" />,
    },
    {
      id: 'favorites' as ActiveView,
      label: 'Favorites',
      icon: <Heart className="w-4 h-4" />,
      badge: likedCount,
    },
  ];

  return (
    <aside className="w-64 bg-bg-surface border-r border-border-muted/60 flex flex-col justify-between h-screen sticky top-0 shrink-0 z-30">
      <div className="flex flex-col gap-6 p-5">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2 pt-1">
          <div className="p-2.5 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-xl text-white shadow-lg shadow-accent-primary/20">
            <Flame className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black bg-gradient-to-r from-accent-primary via-accent-primary-2 to-accent-secondary bg-clip-text text-transparent tracking-tight">
              TasteCraft
            </h1>
            <span className="text-[10px] text-text-body tracking-wider uppercase font-semibold">
              Recipe Workspace
            </span>
          </div>
        </div>

        {/* Quick Action: New Recipe Button */}
        <button
          onClick={onOpenCreateModal}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-accent-primary hover:bg-accent-primary-2 text-white font-semibold text-xs rounded-xl shadow-lg shadow-accent-primary/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Recipe</span>
        </button>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-text-body uppercase tracking-wider px-3 mb-1">
            Navigation
          </span>
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-bg-primary text-text-heading border border-border-muted font-bold'
                    : 'text-text-body hover:text-text-heading hover:bg-bg-primary/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-accent-primary' : ''}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-accent-primary text-white font-bold'
                        : 'bg-bg-primary border border-border-muted text-text-body'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Clean Workspace Footer */}
      <div className="p-4 border-t border-border-muted/60 bg-bg-primary/40 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-accent-secondary/15 text-accent-secondary flex items-center justify-center border border-accent-secondary/30 shrink-0">
          <ChefHat className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-text-heading">TasteCraft Hub</span>
          <span className="text-[10px] text-text-body">MERN Recipe Manager</span>
        </div>
      </div>
    </aside>
  );
};
