import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { createReview, getTechnicianReviews } from '../controllers/reviewController';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/technician/:id', getTechnicianReviews);

export default router;
