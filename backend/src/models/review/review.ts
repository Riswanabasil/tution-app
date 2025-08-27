import mongoose, { Document, Schema, Types } from 'mongoose';
export interface IReview extends Document {
  _id: string;
  courseId: mongoose.Types.ObjectId | string;
  studentId: mongoose.Types.ObjectId | string;
  rating: number;
  comment?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

reviewSchema.index(
  { courseId: 1, studentId: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
const Review = mongoose.model<IReview>('Review', reviewSchema);
export default Review;
