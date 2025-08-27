import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAssignment extends Document {
  _id: Types.ObjectId | string;
  title: string;
  courseId: mongoose.Types.ObjectId | string;
  topicId: mongoose.Types.ObjectId | string;
  dueDate: Date;
  description: string;
  createdBy: mongoose.Types.ObjectId | string | undefined;
  createdAt: Date;
  isDeleted: boolean;
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    topicId: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
    dueDate: { type: Date },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Tutor', required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const AssignmentModel = mongoose.model<IAssignment>('Assignment', AssignmentSchema);
