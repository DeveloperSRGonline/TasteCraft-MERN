import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  recipeId: mongoose.Types.ObjectId;
  portionSize: string;
  customAddons: string[];
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  updatedAt: Date;
}

const CartSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [
      {
        recipeId: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
        portionSize: { type: String, required: true },
        customAddons: [{ type: String }],
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true },
        lineTotal: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Cart = mongoose.model<ICart>('Cart', CartSchema);
