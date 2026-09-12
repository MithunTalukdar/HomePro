import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Booking } from '../models/Booking';


export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { serviceId, serviceName, date, timeSlot, address, price } = req.body;

    const booking = await Booking.create({
      serviceId,
      serviceName,
      customerId: req.user?._id,
      date,
      timeSlot,
      address,
      price,
      statusHistory: [{ status: 'REQUESTED', timestamp: new Date() }]
    });

    res.status(201).json(booking);
  } catch (error: any) {
    console.error('CREATE BOOKING ERROR:', error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
};


export const getMyBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.find({ customerId: req.user?._id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const getBookingById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
      if (booking.customerId.toString() !== req.user?._id.toString() && req.user?.role === 'CUSTOMER') {
        res.status(401).json({ message: 'Not authorized to view this booking' });
        return;
      }
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const updateBookingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, note } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    if (req.user?.role === 'TECHNICIAN' && booking.technicianId && booking.technicianId.toString() !== req.user._id.toString() && status !== 'ASSIGNED') {
       res.status(401).json({ message: 'Not authorized to update this booking' });
       return;
    }

    if (status === 'ASSIGNED' && req.user?.role === 'TECHNICIAN') {
       booking.technicianId = req.user._id;
       booking.technicianName = req.user.name;
    }

    booking.status = status;
    booking.statusHistory.push({ status, note, timestamp: new Date() });

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const updateServiceReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { workDescription, notes, materialsUsed, beforeImages, afterImages } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    if (req.user?.role === 'TECHNICIAN' && booking.technicianId?.toString() !== req.user._id.toString()) {
       res.status(401).json({ message: 'Not authorized' });
       return;
    }

    booking.serviceReport = {
      workDescription,
      notes,
      materialsUsed,
      beforeImages,
      afterImages
    };

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
