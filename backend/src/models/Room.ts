import mongoose, { Document, Schema } from 'mongoose';

export type RoomStatus = 'waiting' | 'active' | 'ended';

export interface IRoom extends Document {
  roomId: string;
  participants: string[];  // Firebase UIDs
  status: RoomStatus;
  createdAt: Date;
  endedAt?: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    roomId: { type: String, required: true, unique: true, index: true },
    participants: [{ type: String }],
    status: { type: String, enum: ['waiting', 'active', 'ended'], default: 'waiting' },
    endedAt: { type: Date },
  },
  { timestamps: true },
);

export const Room = mongoose.model<IRoom>('Room', RoomSchema);
