import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
  participants: string[]; // Array of UIDs
  startTime: Date;
  endTime: Date;
  duration: number; // in seconds
}

const SessionSchema = new Schema<ISession>(
  {
    participants: [{ type: String, required: true }],
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true },
  },
  { timestamps: true },
);

// Index for efficiently finding sessions a user was part of
SessionSchema.index({ participants: 1 });

export const Session = mongoose.model<ISession>('Session', SessionSchema);
