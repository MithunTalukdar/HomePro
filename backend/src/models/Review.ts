import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  bookingId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  technicianId?: mongoose.Types.ObjectId;
  serviceId?: string;
  rating: number; // 1-5
  comment: string;
  isApproved: boolean; // For admin moderation
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    technicianId: { type: Schema.Types.ObjectId, ref: 'User' },
    serviceId: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Review = mongoose.model<IReview>('Review', reviewSchema);
