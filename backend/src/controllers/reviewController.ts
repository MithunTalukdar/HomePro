import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Review } from '../models/Review';
import { Booking } from '../models/Booking';
import { TechnicianProfile } from '../models/TechnicianProfile';

// @route   POST /api/reviews
export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    if (booking.customerId.toString() !== req.user!._id.toString()) {
      res.status(403).json({ message: 'Not authorized to review this booking' });
      return;
    }

    if (booking.status !== 'COMPLETED') {
      res.status(400).json({ message: 'Can only review completed bookings' });
      return;
    }

    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      res.status(400).json({ message: 'Review already exists for this booking' });
      return;
    }

    const review = await Review.create({
      bookingId,
      customerId: req.user!._id,
      technicianId: booking.technicianId,
      serviceId: booking.serviceId,
      rating,
      comment
    });

    // Update technician average rating
    if (booking.technicianId) {
      const allReviews = await Review.find({ technicianId: booking.technicianId });
      const avgRating = allReviews.reduce((acc, item) => acc + item.rating, 0) / allReviews.length;
      
      await TechnicianProfile.findOneAndUpdate(
        { userId: booking.technicianId },
        { rating: avgRating.toFixed(1) }
      );
    }

    res.status(201).json(review);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/reviews/technician/:id
export const getTechnicianReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reviews = await Review.find({ technicianId: req.params.id, isApproved: true })
      .populate('customerId', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
