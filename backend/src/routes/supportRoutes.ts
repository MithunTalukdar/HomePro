import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { createTicket, getCustomerTickets, createWarrantyClaim, getCustomerClaims } from '../controllers/supportController';

const router = express.Router();

router.post('/tickets', protect, createTicket);
router.get('/tickets', protect, getCustomerTickets);

router.post('/warranty', protect, createWarrantyClaim);
router.get('/warranty', protect, getCustomerClaims);

export default router;
