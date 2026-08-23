import mongoose, { Document, Schema } from 'mongoose';

export interface ISupportTicket extends Document {
  customerId: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  issueType: string; // Booking, Payment, Technician, Refund, Warranty, General
  subject: string;
  description: string;
  status: string; // OPEN, IN_PROGRESS, WAITING_FOR_CUSTOMER, RESOLVED, CLOSED
  createdAt: Date;
  updatedAt: Date;
}

const supportTicketSchema = new Schema<ISupportTicket>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    issueType: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'WAITING_FOR_CUSTOMER', 'RESOLVED', 'CLOSED'], default: 'OPEN' },
  },
  { timestamps: true }
);

export const SupportTicket = mongoose.model<ISupportTicket>('SupportTicket', supportTicketSchema);
