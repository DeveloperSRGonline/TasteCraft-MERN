import mongoose, { Schema, Document } from 'mongoose';

export interface IIngredient {
  name: string;
  quantity: number;
  unit: string;
  isOptional: boolean;
}

export interface IStep {
  stepNumber: number;
  instruction: string;
  image?: string;
}

export interface IPortionSize {
  label: string;
  priceOffset: number;
}

export interface IMealAddon {
  name: string;
  price: number;
  iconUrl: string;
}

export interface IRecipe extends Document {
  title: string;
  description: string;
  category: string;
  tags: string[];
  ingredients: IIngredient[];
  steps: IStep[];
  pricing: {
    isOrderable: boolean;
    price: number;
    portionSizes: IPortionSize[];
  };
  mealAddons: IMealAddon[];
  author: mongoose.Types.ObjectId;
  stats: {
    likesCount: number;
    ordersCount: number;
    averageRating: number;
  };
  status: 'published' | 'archived' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

const RecipeSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    tags: [{ type: String }],
    ingredients: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true },
        isOptional: { type: Boolean, default: false },
      },
    ],
    steps: [
      {
        stepNumber: { type: Number, required: true },
        instruction: { type: String, required: true },
        image: { type: String },
      },
    ],
    pricing: {
      isOrderable: { type: Boolean, default: false },
      price: { type: Number, default: 0 },
      portionSizes: [
        {
          label: { type: String, required: true },
          priceOffset: { type: Number, default: 0 },
        },
      ],
    },
    mealAddons: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        iconUrl: { type: String, default: '' },
      },
    ],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stats: {
      likesCount: { type: Number, default: 0 },
      ordersCount: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ['published', 'archived', 'draft'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index on author and status for creator dashboard & queries
RecipeSchema.index({ author: 1, status: 1 });

export const Recipe = mongoose.model<IRecipe>('Recipe', RecipeSchema);
