import express, { Express } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import healthRoutes from './routes/health.js';
import documentRoutes from './routes/documents.js';
import searchRoutes from './routes/search.js';
import capaRoutes from './routes/capas.js';
import kpiRoutes from './routes/kpis.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp(): Express {
  const app = express();

  // Environment detection
  const isElectron = process.env.ELECTRON === 'true' || !!process.versions?.electron;
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = !isProduction && !isElectron;

  console.log('Environment:', {
    isElectron,
    isProduction,
    isDevelopment,
    nodeEnv: process.env.NODE_ENV || 'development'
  });

  // CORS - only in development web mode, not in Electron or production
  if (isDevelopment) {
    app.use(cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true
    }));
    console.log('✓ CORS enabled for development');
  } else {
    console.log('✓ CORS disabled (Electron or production mode)');
  }
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });

  // Serve PDF.js worker files (needed for both web and Electron)
  const pdfjsDistPath = path.join(__dirname, '../../node_modules/pdfjs-dist/build');
  app.use('/pdfjs', express.static(pdfjsDistPath));
  console.log('✓ PDF.js worker files served from /pdfjs');

  // API Routes
  app.use('/api', healthRoutes);
  app.use('/api/documents', documentRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/capas', capaRoutes);
  app.use('/api/kpis', kpiRoutes);

  // Serve frontend static files in production or Electron mode
  if (isProduction || isElectron) {
    const frontendDistPath = path.join(__dirname, '../../frontend/dist');
    
    console.log('✓ Serving static files from:', frontendDistPath);
    
    // Serve static assets
    app.use(express.static(frontendDistPath));
    
    // SPA fallback - serve index.html for all non-API routes
    app.get('*', (req, res) => {
      // Don't serve index.html for API routes
      if (req.path.startsWith('/api') || req.path.startsWith('/pdfjs')) {
        return res.status(404).json({ error: 'API endpoint not found' });
      }
      
      // Serve index.html for all other routes (SPA routing)
      const indexPath = path.join(frontendDistPath, 'index.html');
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error('Error sending index.html:', err);
          res.status(500).send('Failed to load application');
        }
      });
    });
    
    console.log('✓ SPA fallback configured');
  } else {
    // Development 404 handler
    app.use((req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });
  }

  // Error handler
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
      error: 'Internal server error',
      message: isDevelopment ? err.message : undefined
    });
  });

  return app;
}
