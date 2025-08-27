import mongoose, { Document, Schema, Types } from 'mongoose';
export type CourseStatus = 'pending' | 'approved' | 'rejected';

export interface ICourse extends Document {
  _id: Types.ObjectId | string;
  title: string;
  code: string;
  semester: number;
  tutor: mongoose.Types.ObjectId | string;
  thumbnail?: string;
  demoVideoUrl?: string;
  price: number;
  offer?: number;
  actualPrice?: number;
  details?: string;
  status: CourseStatus;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const courseSchema = new mongoose.Schema<ICourse>(
  {
    title: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    semester: { type: Number, required: true },
    tutor: { type: Schema.Types.ObjectId, ref: 'Tutor', required: true },
    thumbnail: { type: String },
    demoVideoUrl: { type: String },
    price: { type: Number, required: true },
    offer: { type: Number },
    actualPrice: { type: Number },
    details: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      required: true,
    },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

export const Course = mongoose.model<ICourse>('Course', courseSchema);
courseSchema.index(
  { status: 1, createdAt: -1 },
  { partialFilterExpression: { deletedAt: { $exists: false } } },
);
courseSchema.index(
  { semester: 1, status: 1 },
  { partialFilterExpression: { deletedAt: { $exists: false } } },
);
courseSchema.index({ tutor: 1, status: 1 });
