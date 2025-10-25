import type { ITutor } from '../../models/tutor/TutorSchema';
import type { ITutorRepository } from '../../repositories/tutor/ITutorRepository';
import type { IHasher } from '../../interfaces/common/IHasher';
import { TutorProfileDTO } from '../../dto/tutor/profile';

// Narrow helper return types (tweak to your actual models as needed)
export type TutorStatus = 'pending' | 'verification-submitted' | 'approved' | 'rejected';

export interface RegisterTutorResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

export interface TutorVerificationInput {
  summary: string;
  education: string;
  experience: string;
  idProof: string;
  resume: string;
}

export interface LoginTutorResponse {
  accessToken: string;
  refreshToken: string;
  tutor: {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
  };
}

export interface GoogleLoginTutorResponse {
  accessToken: string;
  refreshToken: string;
  tutor: {
    id: string;
    name: string;
    email: string;
    status: TutorStatus;
  };
}

export interface TutorStats {
  courseCount: number;
  studentCount: number;
}

// If you have a Course model/type, replace this with it
export interface TutorCourseSummary {
  _id: string;
  title: string;
  code?: string;
  // add more fields you actually return
}

// Keep your token service abstract for testing
export interface ITokenService {
  verifyRefreshTokenAndGenerateAccess(refreshToken: string): Promise<string>;
}

/**
 * Public API that TutorService must implement.
 */
export interface ITutorService {
  registerTutor(
    name: string,
    email: string,
    phone: string,
    password: string,
  ): Promise<RegisterTutorResponse>;

  submitTutorVerification(tutorId: string, details: TutorVerificationInput): Promise<ITutor>;

  loginTutor(email: string, password: string): Promise<LoginTutorResponse>;

  refreshAccessToken(refreshToken: string): Promise<string>;

  googleLoginTutorService(idToken: string): Promise<GoogleLoginTutorResponse>;

  // profile
  getProfile(userId: string): Promise<TutorProfileDTO>;

  updateProfile(userId: string, updates: Partial<ITutor>): Promise<Omit<ITutor, 'password'>>;

  changePassword(userId: string, current: string, next: string): Promise<void>;

  getStats(userId: string): Promise<TutorStats>;

  getMyCourses(userId: string): Promise<TutorCourseSummary[]>;
}

/**
 * Constructor dependencies for TutorService.
 * Prefer interfaces over concrete classes to keep things decoupled.
 */
export interface TutorServiceDeps {
  tutorRepo: ITutorRepository;
  hasher: IHasher;
  tokenService: ITokenService;
}
