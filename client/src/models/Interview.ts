import mongoose, { Schema, Document, Model } from 'mongoose';
import { InterviewType, InterviewStatus } from './types';

export interface IInterview  {
  _id: string;
  application: Schema.Types.ObjectId;
  interviewer: Schema.Types.ObjectId;
  candidate: Schema.Types.ObjectId;
  type: InterviewType;
  status: InterviewStatus;
  scheduledDate: Date;
  duration: number;
  location: string;
  notes?: string;
  feedbackIds?: Schema.Types.ObjectId[];
  roomId?: string;
  videoUrl?: string;

  // timestamps
  createdAt: Date;
  updatedAt: Date;

  // Methods
  updateStatus(status: InterviewStatus): Promise<void>;
  isUpcoming(): boolean;
}

const interviewSchema = new Schema<IInterview>(
  {
    application: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
    interviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    candidate: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: Object.values(InterviewType), default: InterviewType.ONLINE },
    status: { type: String, enum: Object.values(InterviewStatus), default: InterviewStatus.SCHEDULED },
    scheduledDate: { type: Date, required: true },
    duration: { type: Number, required: true },
    location: { type: String },
    notes: { type: String },
    feedbackIds: [{ type: Schema.Types.ObjectId, ref: 'Feedback' }],
    roomId: { type: String },
    videoUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

// Method to update interview status
interviewSchema.methods.updateStatus = async function (status: InterviewStatus): Promise<void> {
  this.status = status;
  await this.save();
};

// Method to check if the interview is in the future
interviewSchema.methods.isUpcoming = function (): boolean {
  return new Date(this.scheduledDate) > new Date();
};

const Interview: Model<IInterview> = mongoose.model<IInterview>('Interview', interviewSchema);
export default Interview;
