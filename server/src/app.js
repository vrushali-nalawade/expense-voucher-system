import express from 'express';
import cors from 'cors';
import path from 'path';

// Route Imports
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import voucherRoutes from './routes/voucher.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

// Middleware Imports
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

// Core Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Signature Images Static Directory
app.use('/uploads', express.static(path.resolve('uploads')));

// Root Route Handler
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'Welcome to Expense Voucher Management System REST API',
    healthCheck: '/api/health',
  });
});

// Root Healthcheck API Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'Expense Voucher Management System REST API',
    timestamp: new Date().toISOString(),
  });
});

// API Module Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `API route '${req.originalUrl}' not found.` });
});

// Global Error Handler
app.use(errorHandler);

export default app;