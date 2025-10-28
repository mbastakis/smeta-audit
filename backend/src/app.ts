import express, { Express } from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.js';
import documentRoutes from './routes/documents.js';
import searchRoutes from './routes/search.js';
import capaRoutes from './routes/capas.js';

export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
  }));
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });

  // Routes
  app.use('/api', healthRoutes);
  app.use('/api/documents', documentRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/capas', capaRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  // Error handler
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  return app;
}
