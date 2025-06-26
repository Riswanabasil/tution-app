import { ObjectId } from "mongoose";

export interface PaginatedTutors {
  tutors: {
    _id: string;
    name: string;
    email: string;
    status: string;
    assignedCourse?: ObjectId[] | null;
  }[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface TutorDetails {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isGoogleSignup: boolean;
  status: string;
  verificationDetails?: {
    education: string;
    experience: string;
    summary: string;
    idProof: string;
    resume: string;
  };
}
