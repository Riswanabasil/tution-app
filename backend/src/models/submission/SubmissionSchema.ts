import { Types } from "mongoose";
import mongoose, { Schema } from "mongoose";

export interface ISubmission extends Document {
  _id?: Types.ObjectId;
  studentId: Types.ObjectId|string;
  topicId: Types.ObjectId|string;
  courseId: Types.ObjectId|string;
  assignmentId: Types.ObjectId|string;
  response:string;
  submittedFile: string;
  feedback?: string;
  status?: "pending" | "verified";
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
const submissionSchema = new Schema<ISubmission>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    response:{
      type:String
    },
    submittedFile: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "verified"],
      default: "pending",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const SubmissionModel = mongoose.model<ISubmission>("Submission", submissionSchema);
