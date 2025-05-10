// server/src/app.ts
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import applicationRoutes from './routes/applicationRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import { notFound, errorHandler } from './middlewares/error';

const app: Application = express();

// Security middleware
app.use(helmet());

// Enable CORS with options
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Parse JSON request body
app.use(express.json());

// Parse URL-encoded request body
app.use(express.urlencoded({ extended: true }));

// Compress responses
app.use(compression());

// Logging middleware in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// API Routes
app.use('/api/applications', applicationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../../client/build')));

  // Any route that is not an API route will be redirected to index.html
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'));
  });
} else {
  // Basic route for development
  app.get('/', (req: Request, res: Response) => {
    res.json({ 
      message: 'Welcome to Loan Manager API',
      version: '1.0.0',
      endpoints: {
        applications: '/api/applications',
        dashboard: '/api/dashboard',
        health: '/api/health'
      }
    });
  });
}

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

export default app;