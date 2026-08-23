import mongoose, { Document, Schema } from 'mongoose';

export interface ITechnicianProfile extends Document {
  user: mongoose.Types.ObjectId;
  bio: string;
  skills: string[];
  experienceYears: number;
  serviceAreas: string[]; // e.g., zip codes or city names
  availability: boolean;
  rating: number;
  totalRatings: number;
  completedJobs: number;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  documents: {
    idProofUrl?: string;
    certificationUrl?: string;
  };
  languages: string[];
}

const technicianProfileSchema = new Schema<ITechnicianProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bio: { type: String, required: true },
    skills: [{ type: String }],
    experienceYears: { type: Number, default: 0 },
    serviceAreas: [{ type: String }],
    availability: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    verificationStatus: { 
      type: String, 
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING'
    },
    documents: {
      idProofUrl: { type: String },
      certificationUrl: { type: String }
    },
    languages: [{ type: String }]
  },
  { timestamps: true }
);

export const TechnicianProfile = mongoose.model<ITechnicianProfile>('TechnicianProfile', technicianProfileSchema);
