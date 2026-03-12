import mongoose, { Document, Schema } from 'mongoose';

export interface IBan extends Document {
  bannedUid: string;
  bannedBy: string; // Admin UID or 'system'
  reason: string;
  expiresAt?: Date; // Optional for permanent bans
  createdAt: Date;
  updatedAt: Date;
}

const BanSchema = new Schema<IBan>(
  {
    bannedUid: { type: String, required: true, unique: true, index: true },
    bannedBy: { type: String, required: true },
    reason: { type: String, required: true },
    expiresAt: { type: Date },
  },
  { timestamps: true },
);

export const Ban = mongoose.model<IBan>('Ban', BanSchema);
