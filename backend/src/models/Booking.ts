import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  serviceId: string;
  serviceName: string;
  customerId: mongoose.Types.ObjectId;
  technicianId?: mongoose.Types.ObjectId;
  technicianName?: string;
  date: string;
  timeSlot: string;
  address: {
    address: string;
    city: string;
    pincode: string;
  };
  price: string;
  status: 'REQUESTED' | 'CONFIRMED' | 'ASSIGNED' | 'ON_THE_WAY' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  statusHistory: {
    status: string;
    timestamp: Date;
    note?: string;
  }[];
  serviceReport?: {
    workDescription?: string;
    notes?: string;
    materialsUsed?: string[];
    beforeImages?: string[];
    afterImages?: string[];
  };
}

const bookingSchema = new Schema<IBooking>(
  {
    serviceId: { type: String, required: true },
    serviceName: { type: String, required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    technicianId: { type: Schema.Types.ObjectId, ref: 'User' },
    technicianName: { type: String },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    address: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    price: { type: String, required: true },
    paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'], default: 'PENDING' },
    couponId: { type: Schema.Types.ObjectId, ref: 'Coupon' },
    discountAmount: { type: Number, default: 0 },
    status: { 
      type: String, 
      enum: ['REQUESTED', 'CONFIRMED', 'ASSIGNED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'REQUESTED'
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String }
      }
    ],
    serviceReport: {
      workDescription: { type: String },
      notes: { type: String },
      materialsUsed: [{ type: String }],
      beforeImages: [{ type: String }],
      afterImages: [{ type: String }]
    }
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
