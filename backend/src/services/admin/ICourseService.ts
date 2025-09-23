import { ICourse } from '../../models/course/CourseSchema';
import { CourseStatus, PaginatedCourses } from '../../types/course';

export interface IAdminCourseService {
  listPaginated(page: number, limit: number,status:CourseStatus,search:string|undefined): Promise<PaginatedCourses>;
  updateStatus(id: string, status: ICourse['status']): Promise<ICourse>;
}
