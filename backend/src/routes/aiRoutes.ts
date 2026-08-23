import express from 'express';
import { handleAIRequest } from '../controllers/aiController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/chat', protect, handleAIRequest);

export default router;
