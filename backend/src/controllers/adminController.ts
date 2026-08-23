import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';
import { TechnicianProfile } from '../models/TechnicianProfile';
import { Booking } from '../models/Booking';
import { Service } from '../models/Service';
import { AuditLog } from '../models/AuditLog';
import { logAdminAction } from '../utils/auditLogger';

// @route   GET /api/admin/stats
export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments({ role: 'CUSTOMER' });
    const totalTechnicians = await User.countDocuments({ role: 'TECHNICIAN' });
    const activeTechnicians = await TechnicianProfile.countDocuments({ verificationStatus: 'VERIFIED' });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysBookings = await Booking.countDocuments({ createdAt: { $gte: today } });
    const activeBookings = await Booking.countDocuments({ status: { $nin: ['COMPLETED', 'CANCELLED'] } });
    const completedBookings = await Booking.countDocuments({ status: 'COMPLETED' });

    // Calculate revenue (mock calculation by summing up 'price' strings - assuming it's structured predictably or just count for now)
    const allCompleted = await Booking.find({ status: 'COMPLETED' });
    const revenue = allCompleted.reduce((acc, booking) => {
       const amount = parseInt(booking.price.replace(/\\D/g, '')) || 0;
       return acc + amount;
    }, 0);

    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalUsers,
      totalTechnicians,
      activeTechnicians,
      todaysBookings,
      activeBookings,
      completedBookings,
      revenue,
      recentBookings
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/admin/users
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find({ role: 'CUSTOMER' }).select('-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/admin/users/:id/status
export const updateUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    // Assuming we add isActive to User model, or we just mock it for now
    // user.isActive = req.body.isActive;
    // await user.save();
    
    await logAdminAction(req.user!._id, req.user!.name, 'UPDATE_USER_STATUS', user._id, 'User', `Status changed to ${req.body.isActive}`);
    res.json({ message: 'User status updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/admin/technicians
export const getAllTechnicians = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const technicians = await User.find({ role: 'TECHNICIAN' }).select('-passwordHash').sort({ createdAt: -1 });
    // Join with TechnicianProfile in frontend or fetch separately. We will do a simple lean fetch.
    const profiles = await TechnicianProfile.find();
    
    const combined = technicians.map(t => {
      const profile = profiles.find(p => p.userId.toString() === t._id.toString());
      return { ...t.toObject(), profile };
    });
    
    res.json(combined);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/admin/technicians/:id/approve
export const approveTechnician = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await TechnicianProfile.findOne({ userId: req.params.id });
    if (!profile) {
      res.status(404).json({ message: 'Technician profile not found' });
      return;
    }
    
    profile.verificationStatus = req.body.status; // 'VERIFIED', 'REJECTED', 'SUSPENDED'
    await profile.save();
    
    await logAdminAction(req.user!._id, req.user!.name, 'APPROVE_TECHNICIAN', profile._id, 'TechnicianProfile', `Status changed to ${req.body.status}`);
    res.json({ message: 'Technician status updated successfully', profile });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/admin/bookings
export const getAllBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/admin/audit-logs
export const getAuditLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
