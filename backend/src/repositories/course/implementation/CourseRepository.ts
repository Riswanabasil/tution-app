import { Course, ICourse } from "../../../models/course/CourseSchema";
import { ICourseRepository, IPaginateOptions } from "../ICourseRepository";

export class CourseRepository implements ICourseRepository {
  async create(data: Partial<ICourse>): Promise<ICourse> {
    const created = await Course.create(data);
    return created;
  }

  async findById(id: string): Promise<ICourse | null> {
    return Course.findById(id).exec();
  }

  async findMany(
    filter: any,
    { skip, limit, sort = { createdAt: -1 } }: IPaginateOptions
  ): Promise<ICourse[]> {
    return Course.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate("tutor", "name email")
      .exec();
  }

  async countDocuments(filter: any): Promise<number> {
    return Course.countDocuments(filter).exec();
  }

  async update(id: string, data: Partial<ICourse>): Promise<ICourse | null> {
    return Course.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async softDelete(id: string): Promise<void> {
    await Course.findByIdAndUpdate(id, { deletedAt: new Date() }).exec();
  }
}
