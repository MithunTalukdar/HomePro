import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  paymentMethod: string;
  provider: string;
  transactionId: string;
  orderId?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    paymentMethod: { type: String, required: true },
    provider: { type: String, default: 'Razorpay' },
    transactionId: { type: String },
    orderId: { type: String },
    status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
