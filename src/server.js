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

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = {
  port: process.env.PORT || 3000,
  srcDir: path.join(__dirname, '..', 'app'),
  distDir: path.join(__dirname, '..', 'dist'),
  indexHtml: 'index.html'
};

const isProduction = process.env.NODE_ENV === 'production';

async function createServer() {
  const app = express();

  app.use(compression());
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
    app.use(express.static(path.join(config.distDir, 'client'), {
      index: false,
      maxAge: '1d',
      immutable: true
    }));
  }

  app.use('/', routes);

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;

    if (url.startsWith('/api/')) {
      return next();
    }

    try {
      let template, render;

      if (!isProduction) {
        template = await vite.transformIndexHtml(url, fs.readFileSync(path.join(config.srcDir, 'index.html'), 'utf-8'));
        render = (await vite.ssrLoadModule('/app/entry-server.jsx')).render;
      } else {
        template = fs.readFileSync(path.join(config.distDir, 'client', 'index.html'), 'utf-8');
        const serverEntry = await import('../dist/server/entry-server.js');
        render = serverEntry.render;
      }

      const appHtml = await render(url);

      const html = template.replace(`<div id="app"></div>`, `<div id="app">${appHtml}</div>`);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      if (!isProduction) {
        vite.ssrFixStacktrace(e);
      }
      next(e);
    }
  });

  app.use(express.static(path.join(__dirname, '..', 'public'), {
    maxAge: '1d'
  }));

  app.listen(config.port, () => {
    logger.info(`Server listening at :${config.port}`);
  });
}

createServer();
