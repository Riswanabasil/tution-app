import { ICourse } from '../../models/course/CourseSchema';

export interface PaginatedCourses {
  courses: ICourse[];
  totalPages: number;
  currentPage: number;
}

export interface ITutorCourseService {
  createCourse(data: Partial<ICourse>): Promise<ICourse>;
  getAllCourses(
    tutorId: string,
    page: number,
    limit: number,
    search?: string,
  ): Promise<PaginatedCourses>;
  getCourseById(id: string): Promise<ICourse | null>;
  updateCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null>;
  // deleteCourse(id: string): Promise<void>;

  softDeleteCourse(id: string): Promise<void>;
  reapply(courseId: string, tutorId: string): Promise<ICourse>;
}
