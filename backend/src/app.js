import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';

import authRoutes from './routes/auth.routes.js';
import patientRoutes from './routes/patient.routes.js';
import serviceRoutes from './routes/service.routes.js';
import queueRoutes from './routes/queue.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

import { globalErrorHandler, notFoundHandler } from './middleware/error.middleware.js';

const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true
  })
);

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'ePILA backend is running'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;