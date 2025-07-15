import { ICourse } from "../../models/course/CourseSchema";

export interface PaginatedCourses {
  courses: ICourse[];
  currentPage: number;
  totalPages: number;
}

export interface ICourseService{
listApproved(
    page: number,
    limit: number,
    search: string
  ): Promise<PaginatedCourses>
}