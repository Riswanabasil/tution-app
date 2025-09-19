import { Types } from 'mongoose';
import Review, { IReview as IReviewDoc } from '../../../models/review/review';
import type { IReviewRepository } from '../IReviewRepository';
import type {
  CreateReviewInput,
  Paginated,
  Reviews,
  UpdateReviewInput,
} from '../../../types/Review';
import { toDTO } from '../../../utils/review';
import { ReviewDTO } from '../../../dto/student/review';

export class ReviewRepository implements IReviewRepository {
  async create(payload: CreateReviewInput): Promise<Reviews> {
    const doc = await Review.create({
      courseId: payload.courseId,
      studentId: payload.studentId,
      rating: payload.rating,
      comment: payload.comment ?? '',
    });
    return toDTO(doc);
  }

  async findById(id: string): Promise<Reviews | null> {
    const doc = await Review.findOne({ _id: id, isDeleted: false });
    return doc ? toDTO(doc) : null;
  }

  async listByCoursePaginated(
    courseId: string,
    page: number,
    limit: number,
  ): Promise<Paginated<Reviews>> {
    const p = Math.max(1, Number(page) || 1);
    const l = Math.max(1, Number(limit) || 10);
    const skip = (p - 1) * l;

    const [docs, total] = await Promise.all([
      Review.find({ courseId, isDeleted: false })
        .populate({ path: 'studentId', select: 'name profilePic' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(l)
        .lean(),
      Review.countDocuments({ courseId, isDeleted: false }),
    ]);

    const items = docs.map(toDTO);
    return {
      items,
      total,
      page: p,
      limit: l,
      hasMore: skip + items.length < total,
    };
  }

  async update(id: string, updates: UpdateReviewInput): Promise<Reviews | null> {
    const $set: Partial<Record<keyof UpdateReviewInput, any>> = {};
    if (typeof updates.rating !== 'undefined') $set.rating = updates.rating;
    if (typeof updates.comment !== 'undefined') $set.comment = updates.comment;

    const doc = await Review.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set },
      { new: true },
    );

    return doc ? toDTO(doc) : null;
  }

  async softDelete(id: string): Promise<boolean> {
    const res = await Review.updateOne(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true } },
    );
    return res.modifiedCount > 0;
  }

  async statsByCourse(courseId: string): Promise<{ count: number; avg: number }> {
    const [row] = await Review.aggregate([
      {
        $match: {
          courseId: new Types.ObjectId(courseId),
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: '$courseId',
          count: { $sum: 1 },
          avg: { $avg: '$rating' },
        },
      },
      { $project: { _id: 0, count: 1, avg: { $round: ['$avg', 1] } } },
    ]);

    return row || { count: 0, avg: 0 };
  }

  async findByCourseAndStudent(
    courseId: string | Types.ObjectId,
    studentId: string | Types.ObjectId,
  ): Promise<ReviewDTO | null> {
    const doc = await Review.findOne({
      courseId,
      studentId,
      $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }],
    });
    return doc ? toDTO(doc) : null;
  }
}
