import express from 'express';
import { createBooking, getMyBookings, getBookingById, updateBookingStatus, updateServiceReport } from '../controllers/bookingController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, authorize('TECHNICIAN', 'ADMIN', 'SUPER_ADMIN'), updateBookingStatus);
router.put('/:id/report', protect, authorize('TECHNICIAN'), updateServiceReport);

export default router;
