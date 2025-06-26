

import mongoose, { Document } from 'mongoose';

export interface ICourse extends Document {
   _id: string,
  title: string;
  code: string;
  semester: number;
  thumbnail?: string;
  price: number;
  offer?: number;
  actualPrice?: number;
  details?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const courseSchema = new mongoose.Schema<ICourse>({
  title: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  semester: { type: Number, required: true },
  thumbnail: { type: String },
  price: { type: Number, required: true },
  offer: { type: Number },
  actualPrice: { type: Number },
  details: { type: String }
}, {
  timestamps: true
});

export const Course = mongoose.model<ICourse>('Course', courseSchema);
