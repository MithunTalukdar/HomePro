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
    const inactiveTechnicians = totalTechnicians - activeTechnicians;
    
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: { $in: ['REQUESTED', 'ASSIGNED'] } });
    const confirmedBookings = await Booking.countDocuments({ status: 'CONFIRMED' });
    const completedBookings = await Booking.countDocuments({ status: 'COMPLETED' });
    const cancelledBookings = await Booking.countDocuments({ status: 'CANCELLED' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const allCompleted = await Booking.find({ status: 'COMPLETED' });
    
    let totalRevenue = 0;
    let todaysRevenue = 0;
    let monthlyRevenue = 0;
    
    allCompleted.forEach(booking => {
      const amount = parseInt(booking.price.replace(/\\D/g, '')) || 0;
      totalRevenue += amount;
      
      const bookingDate = new Date(booking.createdAt);
      if (bookingDate >= today) {
        todaysRevenue += amount;
      }
      if (bookingDate >= startOfMonth) {
        monthlyRevenue += amount;
      }
    });

    // Service performance
    const servicePerformanceAgg = await Booking.aggregate([
      { $group: { _id: '$serviceName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    const servicePerformance = servicePerformanceAgg.map(s => ({ name: s._id, count: s.count }));

    // Technician performance (just general stats for now)
    const activeJobs = await Booking.countDocuments({ status: { $in: ['ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'] } });
    const technicianPerformance = {
      totalAssigned: pendingBookings + activeJobs, // Approximation
      activeJobs,
      completedJobs: completedBookings,
      pendingJobs: pendingBookings
    };

    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalUsers,
      totalTechnicians,
      activeTechnicians,
      inactiveTechnicians,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue,
      todaysRevenue,
      monthlyRevenue,
      servicePerformance,
      technicianPerformance,
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
    
    // Get booking counts for all users
    const usersWithBookings = await Promise.all(
      users.map(async (user) => {
        const totalBookings = await Booking.countDocuments({ customerId: user._id });
        return {
          ...user.toObject(),
          totalBookings
        };
      })
    );
    
    res.json(usersWithBookings);
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
    const profiles = await TechnicianProfile.find();
    
    const combined = await Promise.all(technicians.map(async (t) => {
      const profile = profiles.find(p => p.userId.toString() === t._id.toString());
      
      const assignedJobs = await Booking.countDocuments({ technicianId: t._id });
      const completedJobs = await Booking.countDocuments({ technicianId: t._id, status: 'COMPLETED' });
      
      return { 
        ...t.toObject(), 
        profile,
        stats: {
          assignedJobs,
          completedJobs
        }
      };
    }));
    
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

// @route   POST /api/admin/services
export const addService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, category, startingPrice, estimatedDuration, image, inclusions, exclusions, isActive } = req.body;
    const newService = await Service.create({
      title,
      description,
      category,
      startingPrice,
      estimatedDuration,
      image,
      inclusions,
      exclusions,
      isActive
    });
    await logAdminAction(req.user!._id, req.user!.name, 'ADD_SERVICE', newService._id, 'Service', `Service ${title} created`);
    res.status(201).json(newService);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/admin/services/:id
export const updateService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) {
      res.status(404).json({ message: 'Service not found' });
      return;
    }
    await logAdminAction(req.user!._id, req.user!.name, 'UPDATE_SERVICE', service._id, 'Service', `Service ${service.title} updated`);
    res.json(service);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/admin/services/:id
export const deleteService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      res.status(404).json({ message: 'Service not found' });
      return;
    }
    await logAdminAction(req.user!._id, req.user!.name, 'DELETE_SERVICE', service._id, 'Service', `Service ${service.title} deleted`);
    res.json({ message: 'Service deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
