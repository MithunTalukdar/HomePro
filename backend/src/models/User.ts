import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAddress {
  label: string;
  address: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN' | 'SUPER_ADMIN';
  profileImage?: string;
  isVerified: boolean;
  addresses: IAddress[];
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const addressSchema = new Schema<IAddress>({
  label: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['CUSTOMER', 'TECHNICIAN', 'ADMIN', 'SUPER_ADMIN'], default: 'CUSTOMER' },
    profileImage: { type: String },
    isVerified: { type: Boolean, default: false },
    addresses: [addressSchema],
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

export const User = mongoose.model<IUser>('User', userSchema);
