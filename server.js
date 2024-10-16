import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import logger from './src/config/logger.js';
import routes from './src/routes/routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Add this middleware to disable any potential rate limiting
app.use((req, res, next) => {
  req.rateLimit = { limit: Infinity, remaining: Infinity, reset: 0 };
  next();
});

app.use('/', routes);

if (process.env.NODE_ENV === 'development') {
  const { createServer: createViteServer } = await import('vite');
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
    root: path.join(__dirname, 'src')
  }).then(vite => {
    app.use(vite.middlewares);
    
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;

      try {
        let template = await vite.transformIndexHtml(url, 
          fs.readFileSync(path.resolve(__dirname, 'src/index.html'), 'utf-8')
        );
        
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  });
} else {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  // Serve static files from the 'dist' directory
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // Serve index.html for all routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

async function startServer() {
  try {    
    app.listen(port, () => {
      logger.info(`Server listening at :${port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
