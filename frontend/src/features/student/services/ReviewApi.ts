import { getAxios } from '../../../api/Axios';
const api = getAxios('student');

export interface ReviewDTO {
  _id: string;
  courseId: string;
  studentId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
   studentName?: string;
  studentAvatar?: string;
}

export type CreateReviewInput = {
  courseId: string;
  rating: number;
  comment?: string;
};

export type UpdateReviewInput = {
  rating?: number;
  comment?: string;
};
export type Paginated<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
};
export async function getMyReview(courseId: string): Promise<ReviewDTO | null> {
  const { data } = await api.get<ReviewDTO | null>(`/student/courses/${courseId}/reviews/mine`);
  return data ?? null;
}

export async function createReview(input: CreateReviewInput): Promise<ReviewDTO> {
  const { data } = await api.post<ReviewDTO>("/student/reviews", input);
  return data;
}

export async function updateReview(id: string, input: UpdateReviewInput): Promise<ReviewDTO> {
  const { data } = await api.patch<ReviewDTO>(`/student/reviews/${id}`, input);
  return data;
}

export async function getCourseStats(courseId: string): Promise<{ count: number; avg: number }> {
  const { data } = await api.get<{ count: number; avg: number }>(`/student/courses/${courseId}/reviews/stats`);
  return data;
}

export async function getCourseReviews(
  courseId: string,
  page = 1,
  limit = 5
): Promise<Paginated<ReviewDTO>> {
  const { data } = await api.get<Paginated<ReviewDTO>>(
    `/student/courses/${courseId}/reviews`,
    { params: { page, limit } }
  );
  return data;
}
