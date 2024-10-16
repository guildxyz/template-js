import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import logger from './config/logger.js';
import routes from './routes/routes.js';

dotenv.config();

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const config = {
  port: process.env.PORT || 3000,
  srcDir: path.join(__dirname, '..', 'app'),
  distDir: path.join(__dirname, '..', 'dist'),
  indexHtml: 'index.html'
};

const app = express();

app.use(express.json());

// Add this middleware to disable any potential rate limiting
app.use((req, res, next) => {
  req.rateLimit = { limit: Infinity, remaining: Infinity, reset: 0 };
  next();
});

app.use('/', routes);

if (process.env.NODE_ENV === 'development') {
  const { createServer: createViteServer } = await import('vite');

  createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
    root: config.srcDir
  }).then(vite => {
    app.use(vite.middlewares);
    
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;

      try {
        let template = await vite.transformIndexHtml(url, 
          fs.readFileSync(path.join(config.srcDir, config.indexHtml), 'utf-8')
        );
        
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  });
} else {
  // Serve static files from the 'dist' directory
  app.use(express.static(config.distDir));
  
  // Serve index.html for all routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(config.distDir, config.indexHtml));
  });
}

app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

async function startServer() {
  try {    
    app.listen(config.port, () => {
      logger.info(`Server listening at :${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
