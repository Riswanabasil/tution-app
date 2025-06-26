import { ICourse } from "../../../models/CourseSchema";
import { TutorRepository } from "../../../repositories/tutor/implementation/TutorRepository";


export const getAssignedCourses = async (tutorId: string): Promise<ICourse[]> => {
  const tutorRepo = new TutorRepository();
  return await tutorRepo.findCoursesByTutorId(tutorId);
};