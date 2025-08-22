import { Types } from "mongoose";
import { Course, ICourse } from "../../../models/course/CourseSchema";
import { CourseListItem, CourseStatus, ICourseRepository, IPaginateOptions, TutorCourseListItem, TutorPendingCourseItem } from "../ICourseRepository";

export class CourseRepository implements ICourseRepository {
  async create(data: Partial<ICourse>): Promise<ICourse> {
    console.log(data);
    
    const created = await Course.create(data);
    console.log(created);
    
    return created;
  }

  async findById(id:Types.ObjectId | string|undefined): Promise<ICourse | null> {
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
    async countByStatusMap(): Promise<Record<"pending" | "approved" | "rejected", number>> {
    const rows = await Course.aggregate<{ _id: string; n: number }>([
      { $match: { $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] } },
      { $group: { _id: "$status", n: { $sum: 1 } } }
    ]).exec();
    return {
      pending: rows.find(r => r._id === "pending")?.n ?? 0,
      approved: rows.find(r => r._id === "approved")?.n ?? 0,
      rejected: rows.find(r => r._id === "rejected")?.n ?? 0,
    };
  }

  async listByStatus(
  status: "pending" | "approved" | "rejected",
  limit: number
): Promise<CourseListItem[]> {
  const docs = await Course.find({
      status,
      $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
    })
    .select("_id title code semester tutor status createdAt")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()            
    .exec();
  return docs.map((d: any) => ({
    _id: String(d._id),
    title: d.title,
    code: d.code,
    semester: d.semester,
    tutor: String(d.tutor),
    status: d.status,
    createdAt: d.createdAt,
  }));
}
  async findByIds(ids: string[]) {
    return Course.find({ _id: { $in: ids } })
      .select("title code semester tutor status createdAt")
      .lean()
      .exec();
  }
async countByStatusForTutor(tutorId: string): Promise<Record<CourseStatus, number>> {
  const rows = await Course.aggregate<{ _id: CourseStatus; n: number }>([
    { $match: { tutor: new Types.ObjectId(tutorId), $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] } },
    { $group: { _id: "$status", n: { $sum: 1 } } }
  ]).exec();

  return {
    pending: rows.find(r => r._id === "pending")?.n ?? 0,
    approved: rows.find(r => r._id === "approved")?.n ?? 0,
    rejected: rows.find(r => r._id === "rejected")?.n ?? 0,
  };
}

async listIdsByTutor(tutorId: string, statuses?: CourseStatus[]): Promise<string[]> {
  const filter: any = { tutor: new Types.ObjectId(tutorId), $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] };
  if (statuses?.length) filter.status = { $in: statuses };
  const docs = await Course.find(filter).select("_id").lean().exec();
  return docs.map(d => String(d._id));
}


async listPendingForTutor(tutorId: string, limit: number): Promise<TutorPendingCourseItem[]> {
  const docs = await Course.find({
      tutor: new Types.ObjectId(tutorId),
      status: "pending",
      $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
    })
    .select("_id title code semester createdAt")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()
    .exec();

  return docs.map((d: any) => ({
    _id: String(d._id),
    title: d.title,
    code: d.code,
    semester: d.semester,
    createdAt: d.createdAt as Date, 
  }));
}

async listByTutor(
  tutorId: string,
  opts: { status?: CourseStatus; skip?: number; limit?: number }
): Promise<TutorCourseListItem[]> {
  const filter: any = {
    tutor: new Types.ObjectId(tutorId),
    $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
  };
  if (opts?.status) filter.status = opts.status;

  const docs = await Course.find(filter)
    .select("_id title code semester status price createdAt")
    .sort({ createdAt: -1 })
    .skip(opts?.skip ?? 0)
    .limit(opts?.limit ?? 20)
    .lean()
    .exec();

  return docs.map((d: any) => ({
    _id: String(d._id),
    title: d.title,
    code: d.code,
    semester: d.semester,
    status: d.status,
    price: d.price,
    createdAt: d.createdAt as Date, 
  }));
}
}
