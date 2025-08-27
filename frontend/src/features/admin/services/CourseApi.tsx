import { getAxios } from '../../../api/Axios';
const adminAxios = getAxios('admin');
import type { ICourse } from '../../../types/course';

export interface IPaginatedCourses {
  courses: ICourse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export const fetchCourses = async (
  page: number,
  limit: number,
  status?: ICourse['status'],
  search?: string,
): Promise<IPaginatedCourses> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (status) params.append('status', status);
  if (search) params.append('search', search);

  const response = await adminAxios.get<IPaginatedCourses>(`/admin/courses?${params.toString()}`);
  return response.data;
};

export const updateCourseStatus = async (
  id: string,
  status: ICourse['status'],
): Promise<ICourse> => {
  const response = await adminAxios.patch<{ updated: ICourse }>(`/admin/courses/${id}/status`, {
    status,
  });
  return response.data.updated;
};
