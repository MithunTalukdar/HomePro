import mongoose, { Document, Schema } from 'mongoose';

export interface IChatMessage extends Document {
  bookingId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  text: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);
