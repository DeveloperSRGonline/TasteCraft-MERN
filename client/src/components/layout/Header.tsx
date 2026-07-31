import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Flame, Plus, User, Check, RefreshCw } from 'lucide-react';
import { getStoredUserId, setStoredUserId } from '../../services/api';

interface HeaderProps {
  onOpenCreateModal: () => void;
  onUserChanged: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCreateModal, onUserChanged }) => {
  const [currentUserId, setCurrentUserId] = useState(getStoredUserId());
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [tempUserId, setTempUserId] = useState(currentUserId);

  const handleSwitchUser = (newId: string) => {
    setStoredUserId(newId);
    setCurrentUserId(newId);
    setTempUserId(newId);
    setIsEditingUser(false);
    onUserChanged();
  };

  const handleSaveCustomUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUserId.trim()) {
      handleSwitchUser(tempUserId.trim());
    }
  };

  return (
    <header className="w-full bg-bg-surface/90 backdrop-blur-md border-b border-border-muted/60 sticky top-0 z-40 px-6 py-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-xl text-white shadow-lg shadow-accent-primary/20">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black bg-gradient-to-r from-accent-primary via-accent-primary-2 to-accent-secondary bg-clip-text text-transparent tracking-tight">
                TasteCraft
              </h1>
              <Badge variant="amber" className="text-[10px] uppercase font-bold tracking-wider">
                MERN CRUD
              </Badge>
            </div>
            <p className="text-xs text-text-body">Recipe Management Practice</p>
          </div>
        </div>

        {/* User Scope Controls & Create CTA */}
        <div className="flex items-center gap-3">
          {/* User ID Pill Switcher */}
          <div className="relative">
            {!isEditingUser ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-primary border border-border-muted rounded-xl text-xs">
                <User className="w-3.5 h-3.5 text-accent-secondary" />
                <span className="text-text-body">User:</span>
                <span className="font-bold text-text-heading">{currentUserId}</span>
                <button
                  onClick={() => setIsEditingUser(true)}
                  className="ml-1.5 p-1 text-text-body hover:text-accent-primary transition-colors cursor-pointer"
                  title="Switch or Edit User ID"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveCustomUser} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={tempUserId}
                  onChange={(e) => setTempUserId(e.target.value)}
                  placeholder="User ID (e.g. user_1)"
                  className="w-28 bg-bg-primary border border-accent-primary rounded-xl px-2.5 py-1 text-xs text-text-heading outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-1.5 bg-accent-primary text-white rounded-lg hover:bg-accent-primary-2 transition-colors cursor-pointer"
                  title="Save User ID"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

          {/* Quick preset user buttons */}
          <div className="hidden sm:flex items-center gap-1 bg-bg-primary p-1 rounded-xl border border-border-muted/50 text-[11px]">
            {['user_1', 'user_2'].map((id) => (
              <button
                key={id}
                onClick={() => handleSwitchUser(id)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  currentUserId === id
                    ? 'bg-accent-primary text-white font-semibold shadow-xs'
                    : 'text-text-body hover:text-text-heading'
                }`}
              >
                {id}
              </button>
            ))}
          </div>

          {/* Create Recipe CTA */}
          <Button variant="primary" size="md" onClick={onOpenCreateModal} className="gap-2 shadow-lg">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Recipe</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
