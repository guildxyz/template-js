import express from 'express';
import cors from 'cors';
import logMiddleware from '../middleware/log.js';

const router = express.Router();

// Enable CORS for all routes
router.use(cors());

router.use(logMiddleware);

export default router;
