import { IReview } from '../models/review/review';
import { Reviews } from '../types/Review';

export function toDTO(doc: IReview): Reviews {
  const s = doc.studentId;
  const studentId = typeof s === 'object' && s?._id ? String(s._id) : String(s);
  const studentName = typeof s === 'object' && 'name' in s ? (s as any).name : undefined;
  const studentAvatar =
    typeof s === 'object' && 'profilePic' in s ? (s as any).profilePic : undefined;
  return {
    _id: String(doc._id),
    courseId: String(doc.courseId),
    studentId: String(doc.studentId),
    studentName,
    studentAvatar,
    rating: doc.rating,
    comment: doc.comment,
    isDeleted: !!doc.isDeleted,
    createdAt: doc.createdAt as Date,
    updatedAt: doc.updatedAt as Date,
  };
}
