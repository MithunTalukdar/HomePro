import mongoose, { Document, Schema } from 'mongoose';

export interface IServiceCategory extends Document {
  name: string;
  description: string;
  icon: string;
  image: string;
  isActive: boolean;
}

export interface IService extends Document {
  title: string;
  description: string;
  category: mongoose.Types.ObjectId;
  startingPrice: number;
  estimatedDuration: string;
  image: string;
  inclusions: string[];
  exclusions: string[];
  warrantyInformation: string;
  isActive: boolean;
}

const serviceCategorySchema = new Schema<IServiceCategory>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const serviceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'ServiceCategory', required: true },
    startingPrice: { type: Number, required: true },
    estimatedDuration: { type: String, required: true },
    image: { type: String },
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    warrantyInformation: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ServiceCategory = mongoose.model<IServiceCategory>('ServiceCategory', serviceCategorySchema);
export const Service = mongoose.model<IService>('Service', serviceSchema);
