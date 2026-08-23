import express from 'express';
import { getMyNotifications, markNotificationRead } from '../controllers/notificationController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getMyNotifications);
router.put('/:id/read', protect, markNotificationRead);

export default router;
