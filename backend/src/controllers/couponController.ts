import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Coupon } from '../models/Coupon';

export const validateCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code, orderValue } = req.body;
    
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    
    if (!coupon) {
      res.status(404).json({ message: 'Invalid or expired coupon' });
      return;
    }
    
    if (new Date() > coupon.expiryDate) {
      res.status(400).json({ message: 'Coupon has expired' });
      return;
    }
    
    if (coupon.usedCount >= coupon.usageLimit) {
      res.status(400).json({ message: 'Coupon usage limit reached' });
      return;
    }
    
    if (orderValue < coupon.minimumOrderValue) {
      res.status(400).json({ message: `Minimum order value must be ₹${coupon.minimumOrderValue}` });
      return;
    }
    

    
    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (orderValue * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }
    
    res.json({
      valid: true,
      discountAmount,
      couponId: coupon._id
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
