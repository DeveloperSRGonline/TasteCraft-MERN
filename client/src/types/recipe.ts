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

export interface Author {
  _id: string;
  username: string;
  profilePic?: string;
  bio?: string;
}

export interface Recipe {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  ingredients: Ingredient[];
  steps: Step[];
  pricing: {
    isOrderable: boolean;
    price: number;
    portionSizes: PortionSize[];
  };
  mealAddons: MealAddon[];
  author: Author;
  stats: {
    likesCount: number;
    ordersCount: number;
    averageRating: number;
  };
  status: 'published' | 'archived' | 'draft';
  createdAt: string;
  updatedAt: string;
}
