import { Types } from 'mongoose';
import { DateRange } from '../types/Enrollment';

export function toObjectIds(ids: string[]) {
  return ids.map((id) => new Types.ObjectId(id));
}
export function matchPaid(range: DateRange, courseIds: string[]) {
  if (!courseIds.length) return { _id: { $exists: false } };
  return {
    status: 'paid',
    courseId: { $in: toObjectIds(courseIds) },
    createdAt: { $gte: range.from, $lte: range.to },
  };
}
