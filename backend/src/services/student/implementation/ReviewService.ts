import { ReviewDTO } from '../../../dto/student/review';
import type {
  IReviewRepository,
} from '../../../repositories/review/IReviewRepository';
import { CreateReviewInput, Paginated, UpdateReviewInput } from '../../../types/Review';
import type { IReviewService } from '../IReviewService';

export class ReviewService implements IReviewService {
  constructor(private repo: IReviewRepository) {}

  async create(payload: CreateReviewInput): Promise<ReviewDTO> {
    return this.repo.create(payload);
  }

  getById(id: string): Promise<ReviewDTO | null> {
    return this.repo.findById(id);
  }

  listByCourse(courseId: string, page: number, limit: number): Promise<Paginated<ReviewDTO>> {
    return this.repo.listByCoursePaginated(courseId, page, limit);
  }

  update(id: string, updates: UpdateReviewInput): Promise<ReviewDTO | null> {
    return this.repo.update(id, updates);
  }

  remove(id: string): Promise<boolean> {
    return this.repo.softDelete(id);
  }

  stats(courseId: string): Promise<{ count: number; avg: number }> {
    return this.repo.statsByCourse(courseId);
  }
}
