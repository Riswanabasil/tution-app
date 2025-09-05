import { IReview } from '../models/review/review';
import { Reviews } from '../types/Review';

export function toDTO(doc: IReview): Reviews {
  return {
    _id: String(doc._id),
    courseId: String(doc.courseId),
    studentId: String(doc.studentId),
    rating: doc.rating,
    comment: doc.comment,
    isDeleted: !!doc.isDeleted,
    createdAt: doc.createdAt as Date,
    updatedAt: doc.updatedAt as Date,
  };
}
