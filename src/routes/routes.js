import express from 'express';
import cors from 'cors';
import logMiddleware from '../middleware/log.js';
import mockController from '../controllers/mock.js';

const router = express.Router();

// Enable CORS for all routes
router.use(cors());

router.use(logMiddleware);

router.get('/api/mock/users', mockController.getUsers);
router.get('/api/mock/users/:id', mockController.getUserById);
router.get('/api/mock/posts', mockController.getPosts);
router.get('/api/mock/posts/:id', mockController.getPostById);

export default router;
