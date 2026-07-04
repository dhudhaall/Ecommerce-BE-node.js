import express from 'express';
import userRoutes from './modules/user/user.routes.js';
import categoryRoutes from './modules/categories/catgory.routes.js';
import productsRoutes from './modules/products/products.routes.js';
import addOnsRoutes from './modules/addOns/addOns.routes.js';
import checkoutRoutes from './modules/checkout/checkout.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { swaggerUi, swaggerSpec } from './config/swagger.js';

const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/uploads", express.static("uploads"));
app.get('/api', (req, res) => {
  res.send('API running 🚀');
});

app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/addons', addOnsRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use(errorHandler);


export default app;