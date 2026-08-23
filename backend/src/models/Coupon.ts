import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  discountType: string; // PERCENTAGE, FIXED
  discountValue: number;
  minimumOrderValue: number;
  expiryDate: Date;
  usageLimit: number; // Total times it can be used globally
  usedCount: number;
  perUserLimit: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: { type: String, enum: ['PERCENTAGE', 'FIXED'], required: true },
    discountValue: { type: Number, required: true },
    minimumOrderValue: { type: Number, default: 0 },
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model<ICoupon>('Coupon', couponSchema);
