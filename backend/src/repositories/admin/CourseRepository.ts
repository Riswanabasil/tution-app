import { Course, ICourse } from '../../models/CourseSchema';
import { BaseRepository } from '../base/BaseRepository';
import mongoose from 'mongoose';

export class CourseRepository extends BaseRepository<ICourse> {
  constructor() {
    super(Course);
  }

  async getPaginatedCourses(page: number, limit: number, search: string) {
    const query: any = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const courses = await Course.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(query);

    return { courses, total };
  }
}
