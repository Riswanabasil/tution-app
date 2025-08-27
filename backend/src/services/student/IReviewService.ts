import type {
  ReviewDTO,
  CreateReviewInput,
  UpdateReviewInput,
  Paginated,
} from '../../repositories/review/IReviewRepository';

export interface IReviewService {
  create(payload: CreateReviewInput): Promise<ReviewDTO>;
  getById(id: string): Promise<ReviewDTO | null>;
  listByCourse(courseId: string, page: number, limit: number): Promise<Paginated<ReviewDTO>>;
  update(id: string, updates: UpdateReviewInput): Promise<ReviewDTO | null>;
  remove(id: string): Promise<boolean>;
  stats(courseId: string): Promise<{ count: number; avg: number }>;
}
