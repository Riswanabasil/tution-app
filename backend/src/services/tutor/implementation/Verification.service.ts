import { TutorRepository } from '../../../repositories/tutor/implementation/TutorRepository';
import { ITutor } from '../../../models/tutor/TutorSchema';

const tutorRepo = new TutorRepository();

export const submitTutorVerificationService = async (
  tutorId: string,
  summary: string,
  education: string,
  experience: string,
  idProof: string,
  resume: string,
): Promise<ITutor | null> => {
  return await tutorRepo.updateVerificationById(tutorId, {
    summary,
    education,
    experience,
    idProof,
    resume,
  });
};
