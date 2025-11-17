import { TutorProfileDTO } from '../../dto/student/TutorProfileDTO';
import { ICourse } from '../../models/course/CourseSchema';
import { CourseDetails } from '../../types/course';

export interface PaginatedCourses {
  courses: ICourse[];
  currentPage: number;
  totalPages: number;
}

export interface ICourseService {
  listApproved(
    page: number,
    limit: number,
    search: string,
    semester?: number,
    sortBy?: string,
  ): Promise<PaginatedCourses>;
  fetchCourseWithModules(courseId: string): Promise<CourseDetails>;
  getTutorProfileByCourseId(courseId: string): Promise<TutorProfileDTO | null>;
}
