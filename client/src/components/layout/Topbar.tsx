import React, { useEffect } from 'react';
import { Search, Plus, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface TopbarProps {
  onOpenSpotlight: () => void;
  onOpenCreateModal: () => void;
  title: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenSpotlight,
  onOpenCreateModal,
  title,
}) => {
  // Listen for Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSpotlight();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSpotlight]);

  return (
    <header className="h-16 border-b border-border-muted/60 bg-bg-surface/80 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between gap-4">
      {/* Title / Breadcrumb */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-text-heading">{title}</h2>
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-accent-secondary bg-accent-secondary/10 px-2.5 py-0.5 rounded-full border border-accent-secondary/20 font-medium">
          <Sparkles className="w-3 h-3" /> Practice CRUD
        </span>
      </div>

      {/* Center/Right Spotlight Trigger & Actions */}
      <div className="flex items-center gap-3">
        {/* Spotlight Search Trigger Button */}
        <button
          onClick={onOpenSpotlight}
          className="flex items-center justify-between w-64 md:w-80 px-3.5 py-1.5 bg-bg-primary hover:bg-bg-primary/80 border border-border-muted/80 hover:border-text-body/40 rounded-xl text-xs text-text-body transition-all cursor-pointer shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-text-body" />
            <span className="text-text-body/70">Spotlight Search...</span>
          </div>
          <kbd className="flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-text-body bg-bg-surface border border-border-muted rounded-md shadow-xs">
            <span>⌘</span>K
          </kbd>
        </button>

        {/* Quick Create CTA */}
        <Button variant="primary" size="sm" onClick={onOpenCreateModal} className="gap-1.5 shadow-md">
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">Add Recipe</span>
        </Button>
      </div>
    </header>
  );
};
