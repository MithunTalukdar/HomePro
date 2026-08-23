import mongoose, { Document, Schema } from 'mongoose';

export interface ILocationTracking extends Document {
  bookingId: mongoose.Types.ObjectId;
  technicianId: mongoose.Types.ObjectId;
  latitude: number;
  longitude: number;
  updatedAt: Date;
}

const locationTrackingSchema = new Schema<ILocationTracking>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    technicianId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { timestamps: true }
);

export const LocationTracking = mongoose.model<ILocationTracking>('LocationTracking', locationTrackingSchema);
