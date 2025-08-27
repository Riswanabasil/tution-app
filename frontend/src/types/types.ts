export interface TutorVerificationDetails {
  education: string;
  experience: string;
  summary: string;
  idProof: string;
  resume: string;
}

export interface ITutor {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  status: 'pending' | 'approved' | 'rejected';
  verificationDetails?: TutorVerificationDetails;
  assignedCourses?: { _id: string; title: string }[];
}

export interface IStudent {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  isBlocked: boolean;
  isGoogleSignup?: boolean;
  role: 'student';
}
