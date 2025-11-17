// mappers/tutorMapper.ts
import { TutorProfileDTO } from "../../dto/student/TutorProfileDTO";
import { ITutor} from "../../models/tutor/TutorSchema";

/**
 * Map a Tutor mongoose doc to a TutorProfileDTO
 */
export function mapTutorToProfileDTO(tutor: ITutor | null): TutorProfileDTO | null {
  if (!tutor) return null;
  return {
    id: tutor._id.toString(),
    name: tutor.name,
    summary: tutor.verificationDetails?.summary ?? undefined,
    education: tutor.verificationDetails?.education ?? undefined,
    experience: tutor.verificationDetails?.experience ?? undefined,
  };
}
