
import axios from '../../../api/AxiosInstance'
import type { CourseDetails, ICourse } from '../../../types/course';

export interface PaginatedCourses {
  courses: ICourse[];
  currentPage: number;
  totalPages: number;
}

export interface MyCourseDTO {
  enrollmentId: string;
  course: CourseDetails;
  enrolledAt: string;
}

export const getApprovedCourses = async (
  page = 1,
  limit = 10,
  search = "",
  semester?: number,
  sortBy?: string
): Promise<PaginatedCourses> => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("limit", String(limit));
  params.append("search", search);

  if (semester !== undefined) params.append("semester", String(semester));
  if (sortBy) params.append("sortBy", sortBy);

  const res = await axios.get<PaginatedCourses>(`/student/courses?${params.toString()}`);
  return res.data;
};

export const fetchCourseDetails = async (id: string): Promise<CourseDetails> => {
  const res = await axios.get<CourseDetails>(`/student/courses/${id}`)
  return res.data
}

export const getMyCourses = async (): Promise<MyCourseDTO[]> => {
  const res = await axios.get<{ data: MyCourseDTO[] }>(
    "/student/mycourses"
  );
  console.log(res);
  
  return res.data.data;
};