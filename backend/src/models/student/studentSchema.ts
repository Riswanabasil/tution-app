import mongoose, { Document, Schema } from "mongoose";

export interface IStudent extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  isGoogleSignup: boolean;
  isBlocked: boolean;
  role: "student";
  isVerified: boolean;
  profilePic: string;
}

const studentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: false },
    password: { type: String, required: false },
    isGoogleSignup: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    role: { type: String, default: "student" },
    isVerified: { type: Boolean, default: false },
    profilePic: {
      type: String,
      default:
        "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg",
    },
  },
  {
    timestamps: true,
  }
);
const Student = mongoose.model<IStudent>("Student", studentSchema);
studentSchema.index({ isVerified: 1 });
studentSchema.index({ isBlocked: 1 });
studentSchema.index({ createdAt: -1 });
export default Student;
