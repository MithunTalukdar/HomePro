import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { validateCoupon } from '../controllers/couponController';

const router = express.Router();

router.post('/validate', protect, validateCoupon);

export default router;
