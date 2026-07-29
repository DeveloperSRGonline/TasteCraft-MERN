export * from './recipe';

export interface CreatorMetrics {
  totalRevenue: number;
  totalOrdersCount: number;
  activeOrdersCount: number;
  completedOrdersCount: number;
  publishedRecipesCount: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
}

export interface OrderCustomer {
  _id: string;
  username: string;
  email: string;
  profilePic?: string;
}

export interface OrderItem {
  recipeId: {
    _id: string;
    title: string;
    category: string;
    pricing: {
      price: number;
      isOrderable: boolean;
    };
  };
  portionSize: string;
  customAddons: string[];
  quantity: number;
  price: number;
}

export interface CreatorOrder {
  _id: string;
  customer: OrderCustomer;
  creator: string;
  items: OrderItem[];
  totalAmount: number;
  discountCode?: string;
  deliveryFee: number;
  razorpayOrderId: string;
  orderStatus: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface TopRecipeItem {
  id: string;
  title: string;
  category: string;
  price: number;
  isOrderable: boolean;
  likesCount: number;
  ordersCount: number;
  averageRating: number;
  status: 'published' | 'archived' | 'draft';
}
