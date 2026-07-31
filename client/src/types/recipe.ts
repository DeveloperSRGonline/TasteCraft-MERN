export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  isOptional: boolean;
}

export interface Step {
  stepNumber: number;
  instruction: string;
  image?: string;
}

export interface PortionSize {
  label: string;
  priceOffset: number;
}

export interface MealAddon {
  name: string;
  price: number;
  iconUrl: string;
}

export interface Pricing {
  isOrderable: boolean;
  price: number;
  portionSizes: PortionSize[];
}

export interface Author {
  _id: string;
  username: string;
  profilePic: string;
  bio?: string;
}

export interface Stats {
  likesCount: number;
  ordersCount: number;
  averageRating: number;
}

export interface Recipe {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  ingredients: Ingredient[];
  steps: Step[];
  pricing?: Pricing;
  mealAddons?: MealAddon[];
  author?: Author;
  stats?: Stats;
  status?: string;
  likesCount?: number;
  likedBy?: string[];
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export type RecipeCategory = 'All' | 'Main Dish' | 'Street Food' | 'Vegan' | 'Desserts' | 'Breakfast' | 'Snacks' | 'Beverages';
