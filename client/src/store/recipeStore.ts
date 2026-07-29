import { create } from 'zustand';

export type FeedTab = 'explore' | 'my-recipes';

interface RecipeStoreState {
  activeTab: FeedTab;
  searchQuery: string;
  selectedCategory: string;
  setActiveTab: (tab: FeedTab) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  resetFilters: () => void;
}

export const useRecipeStore = create<RecipeStoreState>((set) => ({
  activeTab: 'explore',
  searchQuery: '',
  selectedCategory: 'All',
  setActiveTab: (activeTab) => set({ activeTab }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  resetFilters: () => set({ searchQuery: '', selectedCategory: 'All' }),
}));
