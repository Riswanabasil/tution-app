import { ITutor } from '../../models/tutor/TutorSchema';

export interface PagedTutors {
  tutors: Array<{
    id: string;
    name: string;
    email: string;
    status: string;
    // assignedCourses: string[];
  }>;
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface TutorDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  isGoogleSignup: boolean;
  status: string;
  // assignedCourses: string[];
  verificationDetails?: {
    summary?: string;
    education?: string;
    experience?: string;
    idProof?: string;
    resume?: string;
  };
}
export interface TutorVerificationDetails {
  summary?: string;
  education?: string;
  experience?: string;
  idProof?: string|undefined; 
  resume?: string|undefined;  
}
export interface ITutorAdminService {
  getAllTutors(page: number, limit: number, status?: string, search?: string): Promise<PagedTutors>;

  getTutorById(id: string): Promise<TutorDetails>;
  updateTutorStatus(id: string, status: 'approved' | 'rejected'): Promise<void>;
}
