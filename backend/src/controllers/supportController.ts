import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { SupportTicket } from '../models/SupportTicket';
import { WarrantyClaim } from '../models/WarrantyClaim';



export const createTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { issueType, subject, description, bookingId } = req.body;
    const ticket = await SupportTicket.create({
      customerId: req.user!._id,
      bookingId,
      issueType,
      subject,
      description
    });
    res.status(201).json(ticket);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomerTickets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tickets = await SupportTicket.find({ customerId: req.user!._id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



export const createWarrantyClaim = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookingId, issueDescription } = req.body;
    

    const claim = await WarrantyClaim.create({
      customerId: req.user!._id,
      bookingId,
      issueDescription
    });
    res.status(201).json(claim);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomerClaims = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const claims = await WarrantyClaim.find({ customerId: req.user!._id }).sort({ createdAt: -1 });
    res.json(claims);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
