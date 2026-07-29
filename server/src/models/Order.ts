import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  recipeId: mongoose.Types.ObjectId;
  portionSize: string;
  customAddons: string[];
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  customer: mongoose.Types.ObjectId;
  creator: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  discountCode?: string;
  deliveryFee: number;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  orderStatus: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        recipeId: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
        portionSize: { type: String, required: true },
        customAddons: [{ type: String }],
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    discountCode: { type: String },
    deliveryFee: { type: Number, default: 0 },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
