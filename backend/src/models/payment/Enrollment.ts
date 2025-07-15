
import { Schema, model, Document, Types } from "mongoose";
import { ICourse } from "../course/CourseSchema";
import { IStudent } from "../student/studentSchema";

export interface IEnrollment extends Document {
    _id: string; 
  userId: Types.ObjectId | IStudent;
  courseId: Types.ObjectId | ICourse; 
  razorpayOrderId: string;
  status: "pending" | "paid" | "failed";
  amount: number;
  createdAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>({
 userId:        { type: Types.ObjectId, ref: "Student",   required: true },
    courseId:      { type: Types.ObjectId, ref: "Course", required: true },
  razorpayOrderId: { type: String, required: true, unique: true },
  status:    { type: String, enum: ["pending","paid","failed"], default: "pending" },
  amount:    { type: Number, required: true },
}, { timestamps: true });

export const EnrollmentModel = model<IEnrollment>("Enrollment", EnrollmentSchema);
