import logger from '../config/logger.js';

const logMiddleware = (req, res, next) => {
  if (process.env.LOGGING === 'true') {
    const logData = {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    };

    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
      logData.body = req.body;
    }

    logger.info(`HTTP ${req.method} ${req.url}`, logData);
  }

  next();
};

export default logMiddleware;
