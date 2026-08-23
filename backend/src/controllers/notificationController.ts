import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Notification } from '../models/Notification';

// @route   GET /api/notifications
export const getMyNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notifications = await Notification.find({ user: req.user?._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/notifications/:id/read
export const markNotificationRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (notification) {
      if (notification.user.toString() !== req.user?._id.toString()) {
        res.status(401).json({ message: 'Not authorized' });
        return;
      }
      notification.isRead = true;
      await notification.save();
      res.json(notification);
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
