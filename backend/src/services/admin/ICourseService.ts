import { ICourse } from '../../models/course/CourseSchema';
import { PaginatedCourses } from './implementation/CourseService';

export interface IAdminCourseService {
  listPaginated(page: number, limit: number): Promise<PaginatedCourses>;
  updateStatus(id: string, status: ICourse['status']): Promise<ICourse>;
}
