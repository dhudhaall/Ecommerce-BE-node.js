import express from 'express';
import userRoutes from './modules/user/user.routes.js';
import categoryRoutes from './modules/categories/catgory.routes.js';
import productsRoutes from './modules/products/products.routes.js';
import checkoutRoutes from './modules/checkout/checkout.routes.js';
import zonesRoutes from './modules/zones/zones.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { swaggerUi, swaggerSpec } from './config/swagger.js';
import { stripeWebhook } from "./modules/checkout/stripe.webhook.js";
import path from 'path';
import cors from "cors";
import { execSync } from 'child_process';
import prisma from './config/db.js';
const app = express();

app.post(
  "/api/checkout/stripe-webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/uploads", express.static("uploads"));
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Pizzeria Con Amore Backend running 🚀' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.get('/api', (req, res) => {
  res.send('API running 🚀');
});

app.get('/api/init-db', async (req, res) => {
  try {
    const pushOutput = execSync('npx prisma db push --skip-generate --accept-data-loss', {
      encoding: 'utf-8',
      env: process.env,
    });

    let seedOutput = 'Skipped (already seeded)';
    const catCount = await prisma.category.count();
    if (catCount === 0) {
      seedOutput = execSync('node prisma/seed.js', {
        encoding: 'utf-8',
        env: process.env,
      });
    }

    const categories = await prisma.category.findMany();
    res.json({
      success: true,
      message: 'Database schema pushed and initialized!',
      categoriesCount: categories.length,
      pushOutput,
      seedOutput,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stderr: error.stderr ? error.stderr.toString() : undefined,
    });
  }
});

app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/delivery-zones', zonesRoutes);
app.use("/api/admin", adminRoutes);
app.use(errorHandler);


export default app;