export interface Recipe {
  _id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  category: string;
  likesCount: number;
  likedBy: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type RecipeCategory = 'All' | 'Main Dish' | 'Street Food' | 'Vegan' | 'Desserts' | 'Breakfast' | 'Snacks';
