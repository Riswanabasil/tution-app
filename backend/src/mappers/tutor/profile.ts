import { TutorProfileDTO } from "../../dto/tutor/profile";

export class TutorMapper {
  static toProfileDTO(t: any): TutorProfileDTO {
    if (!t) return null as any;
    return {
      _id: t._id?.toString(),
      name: t.name,
      email: t.email,
      phone: t.phone ?? null,
      profilePic: t.profilePic ?? null,
      profilePicKey: t.profilePicKey ?? null,
      role: t.role,
      status: t.status,
      walletBalance: typeof t.walletBalance === 'number' ? t.walletBalance : 0,
      verificationDetails: t.verificationDetails ? {
        summary: t.verificationDetails.summary,
        education: t.verificationDetails.education,
        experience: t.verificationDetails.experience,
        idProof: t.verificationDetails.idProof,
        resume: t.verificationDetails.resume,
      } : null,
      createdAt: t.createdAt ? t.createdAt.toISOString() : undefined,
      updatedAt: t.updatedAt ? t.updatedAt.toISOString() : undefined,
    };
  }
}