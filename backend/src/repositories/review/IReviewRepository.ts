export interface ReviewDTO {
  _id: string;
  courseId: string;
  studentId: string;
  rating: number;
  comment?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateReviewInput = {
  courseId: string;
  studentId: string;
  rating: number;    
  comment?: string;
};

export type UpdateReviewInput = {
  rating?: number;    
  comment?: string;
};

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface IReviewRepository {
  create(payload: CreateReviewInput): Promise<ReviewDTO>;
  findById(id: string): Promise<ReviewDTO | null>;
  listByCoursePaginated(courseId: string, page: number, limit: number): Promise<Paginated<ReviewDTO>>;
  update(id: string, updates: UpdateReviewInput): Promise<ReviewDTO | null>;
  softDelete(id: string): Promise<boolean>;
  statsByCourse(courseId: string): Promise<{ count: number; avg: number }>;
}
