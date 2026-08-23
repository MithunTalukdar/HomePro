import express from 'express';
import { getUserProfile, updateUserProfile, changePassword, getAddresses, addAddress } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/password', protect, changePassword);

router.get('/addresses', protect, getAddresses);
router.post('/addresses', protect, addAddress);

export default router;
