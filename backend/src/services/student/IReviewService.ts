import type {
  Reviews,
  CreateReviewInput,
  UpdateReviewInput,
  Paginated,
} from '../../types/Review';

export interface IReviewService {
  create(payload: CreateReviewInput): Promise<Reviews>;
  getById(id: string): Promise<Reviews | null>;
  listByCourse(courseId: string, page: number, limit: number): Promise<Paginated<Reviews>>;
  update(id: string, updates: UpdateReviewInput): Promise<Reviews | null>;
  remove(id: string): Promise<boolean>;
  stats(courseId: string): Promise<{ count: number; avg: number }>;
}
