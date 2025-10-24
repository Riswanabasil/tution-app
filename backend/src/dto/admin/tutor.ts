export interface TutorDTO {
  _id: string;
  id?: string;           
  name: string;
  email: string;
  status: string;
  phone?: string;
  assignedCourses?: { _id: string; title?: string }[];
  verificationDetails?: {
    education?: string;
    experience?: string;
    summary?: string;
    idProof?: string;
    resume?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}