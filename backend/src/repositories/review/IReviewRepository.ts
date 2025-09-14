import { Types } from 'mongoose';
import { CreateReviewInput, Paginated, Reviews, UpdateReviewInput } from '../../types/Review';

export interface IReviewRepository {
  create(payload: CreateReviewInput): Promise<Reviews>;
  findById(id: string): Promise<Reviews | null>;
  listByCoursePaginated(courseId: string, page: number, limit: number): Promise<Paginated<Reviews>>;
  update(id: string, updates: UpdateReviewInput): Promise<Reviews | null>;
  softDelete(id: string): Promise<boolean>;
  statsByCourse(courseId: string): Promise<{ count: number; avg: number }>;
    findByCourseAndStudent(
    courseId: string | Types.ObjectId,
    studentId: string | Types.ObjectId
  ): Promise<Reviews | null>;
}
