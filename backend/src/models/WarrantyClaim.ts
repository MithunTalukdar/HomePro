import mongoose, { Document, Schema } from 'mongoose';

export interface IWarrantyClaim extends Document {
  bookingId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  technicianId?: mongoose.Types.ObjectId;
  issueDescription: string;
  status: string;
  resolutionNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const warrantyClaimSchema = new Schema<IWarrantyClaim>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    technicianId: { type: Schema.Types.ObjectId, ref: 'User' },
    issueDescription: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED', 'RESOLVED'], default: 'PENDING' },
    resolutionNotes: { type: String },
  },
  { timestamps: true }
);

export const WarrantyClaim = mongoose.model<IWarrantyClaim>('WarrantyClaim', warrantyClaimSchema);
