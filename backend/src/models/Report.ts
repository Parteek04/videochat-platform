import mongoose, { Document, Schema } from 'mongoose';

export type ReportStatus = 'pending' | 'reviewed' | 'resolved';

export interface IReport extends Document {
  reporterId: string;
  reportedId: string;
  reason: string;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reporterId: { type: String, required: true, index: true },
    reportedId: { type: String, required: true, index: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'reviewed', 'resolved'], default: 'pending' },
  },
  { timestamps: true },
);

export const Report = mongoose.model<IReport>('Report', ReportSchema);
