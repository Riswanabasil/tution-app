import mongoose, { Document, Schema } from 'mongoose';

export interface IModule extends Document {
   _id: string,
  courseId: mongoose.Types.ObjectId;
  name: string;
  order: number;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const moduleSchema = new Schema<IModule>({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  name:     { type: String, required: true },
  order:    { type: Number, required: true },
  deletedAt:{ type: Date }
}, {
  timestamps: true
});

export const Module = mongoose.model<IModule>('Module', moduleSchema);