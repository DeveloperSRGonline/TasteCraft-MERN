import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { Order } from '../models/Order';
import { Recipe } from '../models/Recipe';
import { AuthenticatedRequest } from '../middleware/auth';

/**
 * Helper to call Razorpay Orders API directly via fetch
 */
const createRazorpayOrderViaApi = async (amountInPaisa: number, receipt: string) => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    // Return a realistic mock order structure if keys are not set for local dev testing
    return {
      id: `order_mock_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      entity: 'order',
      amount: amountInPaisa,
      amount_paid: 0,
      amount_due: amountInPaisa,
      currency: 'INR',
      receipt,
      status: 'created',
      attempts: 0,
      notes: [],
      created_at: Math.floor(Date.now() / 1000),
    };
  }

  const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify({
      amount: amountInPaisa,
      currency: 'INR',
      receipt,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Razorpay API error (${response.status}): ${errText}`);
  }

  return await response.json();
};

/**
 * POST /api/v1/orders/create-razorpay-order
 */
export const createRazorpayOrder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { items, deliveryFee = 5.0 } = req.body;
    const mongoUser = req.mongoUser;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Cart items are required' });
      return;
    }

    // Verify recipes and calculate total
    let itemsTotal = 0;
    const formattedItems = [];
    let creatorId = null;

    for (const item of items) {
      const recipe = await Recipe.findById(item.recipeId);
      if (!recipe) {
        res.status(404).json({ error: `Recipe not found: ${item.recipeId}` });
        return;
      }

      if (!creatorId) {
        creatorId = recipe.author;
      }

      const itemPrice = item.unitPrice || recipe.pricing.price;
      const lineTotal = itemPrice * item.quantity;
      itemsTotal += lineTotal;

      formattedItems.push({
        recipeId: recipe._id,
        portionSize: item.portionSize?.label || 'Standard',
        customAddons: item.selectedAddons ? item.selectedAddons.map((a: any) => a.name) : [],
        quantity: item.quantity,
        price: itemPrice,
      });
    }

    const totalAmount = itemsTotal + deliveryFee;
    // Amount in Razorpay paisa (or cents for testing)
    const amountInPaisa = Math.round(totalAmount * 100);

    const receipt = `rcpt_${Date.now().toString().slice(-8)}`;

    const rzOrder = await createRazorpayOrderViaApi(amountInPaisa, receipt);

    // Save pending Order record in MongoDB
    const newOrder = await Order.create({
      customer: mongoUser._id,
      creator: creatorId || mongoUser._id,
      items: formattedItems,
      totalAmount,
      deliveryFee,
      razorpayOrderId: rzOrder.id,
      orderStatus: 'Pending',
    });

    res.json({
      success: true,
      orderId: newOrder._id,
      razorpayOrderId: rzOrder.id,
      amount: rzOrder.amount,
      currency: rzOrder.currency || 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKey123',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/orders/verify-payment
 */
export const verifyRazorpayPayment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const order = await Order.findOne({ razorpayOrderId });
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keySecret) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (generatedSignature !== razorpaySignature) {
        res.status(400).json({ error: 'Invalid payment signature' });
        return;
      }
    }

    // Payment verification successful
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    order.orderStatus = 'Preparing';
    await order.save();

    // Increment ordersCount on purchased recipes
    for (const item of order.items) {
      await Recipe.findByIdAndUpdate(item.recipeId, {
        $inc: { 'stats.ordersCount': item.quantity },
      });
    }

    res.json({
      success: true,
      message: 'Payment verified and order confirmed successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/orders/webhook (Razorpay Webhook backup confirmation)
 */
export const handleRazorpayWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (secret) {
      const shasum = crypto.createHmac('sha256', secret);
      shasum.update((req as any).rawBody || JSON.stringify(req.body));
      const digest = shasum.digest('hex');

      if (digest !== req.headers['x-razorpay-signature']) {
        res.status(400).json({ error: 'Invalid webhook signature' });
        return;
      }
    }

    const event = req.body.event;
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = req.body.payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;

      const order = await Order.findOne({ razorpayOrderId });
      if (order && order.orderStatus === 'Pending') {
        order.razorpayPaymentId = razorpayPaymentId;
        order.orderStatus = 'Preparing';
        await order.save();

        for (const item of order.items) {
          await Recipe.findByIdAndUpdate(item.recipeId, {
            $inc: { 'stats.ordersCount': item.quantity },
          });
        }
      }
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Razorpay Webhook Error:', error);
    res.status(500).json({ error: 'Webhook handler error' });
  }
};
