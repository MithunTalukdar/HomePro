import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { User, IAddress } from '../models/User';
import bcrypt from 'bcryptjs';

// @route   GET /api/users/profile
export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).select('-passwordHash');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/users/profile
export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      if (req.body.profileImage) user.profileImage = req.body.profileImage;
      
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        profileImage: updatedUser.profileImage,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/users/password
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    const { currentPassword, newPassword } = req.body;

    if (user && (await user.matchPassword(currentPassword))) {
      user.passwordHash = newPassword;
      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ message: 'Incorrect current password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/users/addresses
export const getAddresses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    if (user) {
      res.json(user.addresses);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/users/addresses
export const addAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    if (user) {
      const { label, address, city, pincode, isDefault } = req.body;
      
      if (isDefault) {
        user.addresses.forEach(a => a.isDefault = false);
      }
      
      user.addresses.push({ label, address, city, pincode, isDefault } as IAddress);
      await user.save();
      res.status(201).json(user.addresses);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
