export interface Reviews {
  _id: string;
  courseId: string;
  studentId: string;
   studentName?: string;      
  studentAvatar?: string;    
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
