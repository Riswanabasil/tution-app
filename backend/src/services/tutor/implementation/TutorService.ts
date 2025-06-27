import { ITutorRepository } from "../../../repositories/tutor/ITutorRepository";
import { IHasher } from "../../../interfaces/common/IHasher";
import { ITutor } from "../../../models/tutor/TutorSchema";
import { ITutorService } from "../ITutorService";
import { generateAccessToken, generateRefreshToken } from "../../../utils/GenerateToken";

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

export class TutorService implements ITutorService {
  constructor(
    private tutorRepo: ITutorRepository,
    private hasher: IHasher
  ) {}

  async registerTutor(
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<RegisterTutorResponse> {
    const existing = await this.tutorRepo.findByEmail(email);
    if (existing) throw new Error("Tutor already exists");

    const hashed = await this.hasher.hash(password);

    const newTutor = await this.tutorRepo.create({
      name,
      email,
      phone,
      password: hashed,
      isGoogleSignup: false,
      status: "pending",
      role: "tutor",
    } as ITutor);

    return {
      id: newTutor._id.toString(),
      name: newTutor.name,
      email: newTutor.email,
      phone: newTutor.phone,
      role: newTutor.role,
      status: newTutor.status,
    };
  }

   async submitTutorVerification(
    tutorId: string,
    details: TutorVerificationInput
  ): Promise<ITutor> {
    const updated = await this.tutorRepo.updateVerificationById(tutorId, details
    );
    if (!updated) throw new Error("Tutor not found");
    return updated;
  }

  async loginTutor(
    email: string,
    password: string
  ): Promise<LoginTutorResponse> {
    const tutor = await this.tutorRepo.findByEmail(email);
    if (!tutor) throw new Error("Tutor not found");

    if (tutor.status !== "approved") {
      throw new Error("VERIFICATION_PENDING");
    }

    const valid = await this.hasher.compare(password, tutor.password);
    if (!valid) throw new Error("Incorrect password");

    const accessToken = generateAccessToken(
      tutor._id.toString(),
      tutor.email,
      tutor.role
    );
    const refreshToken = generateRefreshToken(
      tutor._id.toString(),
      tutor.email,
      tutor.role
    );

    return {
      accessToken,
      refreshToken,
      tutor: {
        id: tutor._id.toString(),
        email: tutor.email,
        name: tutor.name,
        role: tutor.role,
        status: tutor.status
      }
    };
  }
}