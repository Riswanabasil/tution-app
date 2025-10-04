import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ILiveSession extends Document {
    _id: Types.ObjectId | string;
  title: string;
  description?: string;
  topicId: Types.ObjectId | string;
  courseId: Types.ObjectId | string;
  createdBy: Types.ObjectId | string;   
  scheduledAt?: Date;                    
  status: 'scheduled' | 'live' | 'ended';
  roomCode: string;                      
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LiveSessionSchema = new Schema<ILiveSession>(
  {
    title: { type: String, required: true },
    description: { type: String },
    topicId: { type: Schema.Types.ObjectId, ref: 'Topic', required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Tutor', required: true, index: true },
    scheduledAt: { type: Date },
    status: { type: String, enum: ['scheduled', 'live', 'ended'], default: 'scheduled', index: true },
    roomCode: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// helpful compound index for listing
LiveSessionSchema.index({ topicId: 1, status: 1, createdAt: -1 });

export const LiveSessionModel = mongoose.model<ILiveSession>('LiveSession', LiveSessionSchema);

