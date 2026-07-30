import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';
import webhookRoutes from './routes/webhookRoutes';
import userRoutes from './routes/userRoutes';
import recipeRoutes from './routes/recipeRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

// Raw body middleware for webhooks verification if needed
app.use(express.json({
  verify: (req: any, _res, buf) => {
    req.rawBody = buf.toString();
  }
}));

import dashboardRoutes from './routes/dashboardRoutes';
import orderRoutes from './routes/orderRoutes';

// Routes
app.use('/api/v1/webhooks', webhookRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/recipes', recipeRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/orders', orderRoutes);

// Health check endpoint
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 TasteCraft Server running on port ${PORT}`);
  });
};

startServer();
