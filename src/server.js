import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './config/logger.js';
import routes from './routes/routes.js';
import { createServer as createViteServer } from 'vite';
import { dirname, resolve } from 'path';
import fs from 'fs';
import compression from 'compression';
import helmet from 'helmet';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const config = {
  port: process.env.PORT || 3000,
  srcDir: path.join(__dirname, '..', 'app'),
  distDir: path.join(__dirname, '..', 'dist'),
  indexHtml: 'index.html'
};

const isProduction = process.env.NODE_ENV === 'production';
const indexPath = path.resolve(__dirname, '../dist/client/index.html');
const serverEntryPath = path.resolve(__dirname, '../dist/server/entry-server.js');

async function createServer() {
  const app = express();

  // Add compression middleware
  app.use(compression());

  // Add security headers
  // app.use(helmet());

  let vite;
  if (!isProduction) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
      root: resolve(__dirname, '..')
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files with caching headers
    app.use(express.static(path.join(config.distDir, 'client'), {
      index: false,
      maxAge: '1d',
      immutable: true
    }));
  }

  app.use('/', routes);

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;

    // Skip SSR for API routes
    if (url.startsWith('/api/')) {
      return next();
    }

    try {
      let template, render;

      if (!isProduction) {
        // Development mode
        template = await vite.transformIndexHtml(url, fs.readFileSync(path.join(config.srcDir, 'index.html'), 'utf-8'));
        render = (await vite.ssrLoadModule('/entry-server.jsx')).render;
      } else {
        // Production mode
        template = fs.readFileSync(indexPath, 'utf-8');
        const serverEntry = require(serverEntryPath);
        render = serverEntry.render || serverEntry.default.render;
      }

      const appHtml = await render(url);

      const html = template.replace(`<div id="app"></div>`, `<div id="app">${appHtml}</div>`);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      console.error(e);
      if (!isProduction) {
        vite.ssrFixStacktrace(e);
      }
      next(e);
    }
  });

  // Serve static files from the public directory with caching
  app.use(express.static(path.join(__dirname, '..', 'public'), {
    maxAge: '1d'
  }));

  app.listen(config.port, () => {
    logger.info(`Server listening at :${config.port}`);
  });
}

createServer();
