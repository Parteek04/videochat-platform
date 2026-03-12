import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  uid: string;         // Firebase UID
  email: string;
  displayName: string;
  photoURL?: string;
  gender?: string;     // 'male' | 'female' | 'both'
  country?: string;    // ISO code e.g. 'IN', 'US', or 'global'
  isOnline: boolean;
  isBanned: boolean;
  totalChats: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    uid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    displayName: { type: String, required: true, default: 'Anonymous' },
    photoURL: { type: String },
    gender: { type: String, default: 'both', enum: ['male', 'female', 'both'] },
    country: { type: String, default: 'global' },
    isOnline: { type: Boolean, default: false, index: true },
    isBanned: { type: Boolean, default: false },
    totalChats: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>('User', UserSchema);
