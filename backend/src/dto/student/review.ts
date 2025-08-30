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