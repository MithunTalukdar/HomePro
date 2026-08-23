import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { TechnicianProfile } from '../models/TechnicianProfile';
import { User } from '../models/User';

// @route   POST /api/technicians/register
export const registerTechnician = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, bio, skills, experienceYears, serviceAreas, documents } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      res.status(400).json({ message: 'User already exists with that email or phone' });
      return;
    }

    const user = await User.create({
      name,
      email,
      phone,
      passwordHash: password,
      role: 'TECHNICIAN'
    });

    const technicianProfile = await TechnicianProfile.create({
      user: user._id,
      bio,
      skills,
      experienceYears,
      serviceAreas,
      documents
    });

    res.status(201).json({ message: 'Technician registered successfully. Pending verification.', profileId: technicianProfile._id });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/technicians/profile
export const getTechnicianProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await TechnicianProfile.findOne({ user: req.user?._id }).populate('user', 'name email phone profileImage');
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ message: 'Technician profile not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
