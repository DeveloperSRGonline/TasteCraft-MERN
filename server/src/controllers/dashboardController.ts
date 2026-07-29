import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/User';
import { Recipe } from '../models/Recipe';
import { Order } from '../models/Order';
import { AuthenticatedRequest } from '../middleware/auth';

/**
 * GET /api/v1/dashboard/metrics
 * Returns total sales, active orders count, total revenue, monthly/daily revenue series, and top performing recipes.
 */
export const getDashboardMetrics = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const mongoUser = req.mongoUser as IUser;
    if (!mongoUser) {
      res.status(401).json({ error: 'User context not found' });
      return;
    }

    const creatorId = mongoUser._id;

    // Fetch all orders for this creator
    const orders = await Order.find({ creator: creatorId }).sort({ createdAt: -1 });

    const totalOrdersCount = orders.length;
    const activeOrdersCount = orders.filter((o) => ['Pending', 'Preparing', 'Out for Delivery'].includes(o.orderStatus)).length;
    const completedOrdersCount = orders.filter((o) => o.orderStatus === 'Delivered').length;

    // Calculate total revenue (from non-cancelled orders)
    const validOrders = orders.filter((o) => o.orderStatus !== 'Cancelled');
    const totalRevenue = validOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Revenue history by month / period for Recharts
    const revenueMap: { [key: string]: number } = {};
    validOrders.forEach((order) => {
      const monthKey = new Date(order.createdAt).toLocaleString('en-US', { month: 'short', year: '2-digit' });
      revenueMap[monthKey] = (revenueMap[monthKey] || 0) + order.totalAmount;
    });

    const revenueGraphData = Object.keys(revenueMap).map((date) => ({
      date,
      revenue: revenueMap[date],
    }));

    // If no order history exists yet, provide sample timeline for visual rendering preview
    if (revenueGraphData.length === 0) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
      months.forEach((m) => {
        revenueGraphData.push({ date: m, revenue: 0 });
      });
    }

    // Top performing recipes for this creator
    const creatorRecipes = await Recipe.find({ author: creatorId }).sort({ 'stats.ordersCount': -1, 'stats.likesCount': -1 }).limit(5);

    const topRecipes = creatorRecipes.map((r) => ({
      id: r._id,
      title: r.title,
      category: r.category,
      price: r.pricing.price,
      isOrderable: r.pricing.isOrderable,
      likesCount: r.stats.likesCount,
      ordersCount: r.stats.ordersCount,
      averageRating: r.stats.averageRating,
      status: r.status,
    }));

    res.json({
      success: true,
      metrics: {
        totalRevenue,
        totalOrdersCount,
        activeOrdersCount,
        completedOrdersCount,
        publishedRecipesCount: await Recipe.countDocuments({ author: creatorId, status: 'published' }),
      },
      revenueGraphData,
      topRecipes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/orders/creator
 * Fetch incoming orders for creator with status filtering
 */
export const getCreatorOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const mongoUser = req.mongoUser as IUser;
    const { status } = req.query;

    const query: any = { creator: mongoUser._id };
    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate('customer', 'username email profilePic')
      .populate('items.recipeId', 'title category pricing')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/orders/:id/status
 * Update order status (Preparing -> Out for Delivery -> Delivered / Cancelled)
 */
export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const mongoUser = req.mongoUser as IUser;
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'Invalid order status transition' });
      return;
    }

    const order = await Order.findOne({ _id: id, creator: mongoUser._id });
    if (!order) {
      res.status(404).json({ error: 'Order not found or unauthorized' });
      return;
    }

    order.orderStatus = status;
    await order.save();

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/dashboard/recipes
 * Content management listing for creator recipes
 */
export const getCreatorRecipes = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const mongoUser = req.mongoUser as IUser;
    const recipes = await Recipe.find({ author: mongoUser._id }).sort({ updatedAt: -1 });

    res.json({
      success: true,
      recipes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/dashboard/recipes/:id/toggle-orderable
 * Toggle recipe orderable status
 */
export const toggleRecipeOrderable = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const mongoUser = req.mongoUser as IUser;
    const { id } = req.params;

    const recipe = await Recipe.findOne({ _id: id, author: mongoUser._id });
    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found or unauthorized' });
      return;
    }

    recipe.pricing.isOrderable = !recipe.pricing.isOrderable;
    await recipe.save();

    res.json({
      success: true,
      isOrderable: recipe.pricing.isOrderable,
      recipe,
    });
  } catch (error) {
    next(error);
  }
};
