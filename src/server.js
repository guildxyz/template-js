import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './config/logger.js';
import routes from './routes/routes.js';
import fs from 'fs/promises';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const config = {
  port: process.env.PORT || 3000,
  srcDir: path.join(__dirname, '..', 'app'),
  distDir: path.join(__dirname, '..', 'dist'),
  indexHtml: 'index.html'
};

const app = express();

app.use(express.json());
app.use('/', routes);

if (process.env.NODE_ENV === 'development') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
    root: config.srcDir
  });

  app.use(vite.middlewares);
  
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      let template = await fs.readFile(path.join(config.srcDir, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
} else {
  app.use(express.static(config.distDir));
  app.get('*', (req, res) => {
    res.sendFile(path.join(config.distDir, config.indexHtml));
  });
}

app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(config.port, () => {
  logger.info(`Server listening at :${config.port}`);
});
