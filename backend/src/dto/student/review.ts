export interface ReviewDTO {
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
