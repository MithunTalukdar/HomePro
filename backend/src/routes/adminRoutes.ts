import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { 
  getStats, 
  getAllUsers, 
  updateUserStatus, 
  getAllTechnicians, 
  approveTechnician, 
  getAllBookings,
  getAuditLogs
} from '../controllers/adminController';

const router = express.Router();

// Apply auth and admin authorization to all routes in this file
router.use(protect);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/technicians', getAllTechnicians);
router.put('/technicians/:id/approve', approveTechnician);
router.get('/bookings', getAllBookings);
router.get('/audit-logs', getAuditLogs);

export default router;
