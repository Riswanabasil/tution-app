export interface TutorProfileDTO {
  _id: string;
  name: string;
  email: string;
  phone?: string | null;
  profilePic?: string | null;
  profilePicKey?: string | null;
  role?: string;
  status?: string;
  walletBalance?: number;
  verificationDetails?: {
    summary?: string;
    education?: string;
    experience?: string;
    idProof?: string;
    resume?: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}