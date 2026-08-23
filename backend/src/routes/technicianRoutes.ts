import express from 'express';
import { registerTechnician, getTechnicianProfile } from '../controllers/technicianController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerTechnician);
router.get('/profile', protect, authorize('TECHNICIAN'), getTechnicianProfile);

export default router;
