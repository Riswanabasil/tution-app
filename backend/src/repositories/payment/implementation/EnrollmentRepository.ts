import { Types } from "mongoose";
import { EnrollmentModel, IEnrollment } from "../../../models/payment/Enrollment";
import { BaseRepository } from "../../base/BaseRepository";
import { DateRange, IEnrollmentRepository, TimeGranularity } from "../IEnrollmentRepository";
 // helper
function toObjectIds(ids: string[]) { return ids.map(id => new Types.ObjectId(id)); }
function matchPaid(range: DateRange, courseIds: string[]) {
  if (!courseIds.length) return { _id: { $exists: false } }; 
  return {
    status: "paid",
    courseId: { $in: toObjectIds(courseIds) },
    createdAt: { $gte: range.from, $lte: range.to }
  };
}


export class EnrollmentRepository extends BaseRepository<IEnrollment> implements IEnrollmentRepository {
   constructor() {
      super(EnrollmentModel);
    }
  async create(data: Partial<IEnrollment>) {
    return EnrollmentModel.create(data);
  }
  async updateStatus(
    orderId: string,
    status: IEnrollment["status"]
  ): Promise<IEnrollment | null> {
    return EnrollmentModel.findOneAndUpdate(
      { razorpayOrderId: orderId },
      { status },
      { new: true }
    );
  }

  async findByOrderId(id: string): Promise<IEnrollment | null> {
    return EnrollmentModel.findOne({ razorpayOrderId:id});
  }

   async updateById(id: string, status: IEnrollment["status"]) {
    return EnrollmentModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  async findPaidByUser(userId: string): Promise<(IEnrollment & { course: any })[]> {
    return EnrollmentModel.find({ userId: userId ,status:"paid"}).sort({createdAt:-1})
      .populate<{ course: any }>("courseId","title thumbnail price")  
      .exec();
  }
  async findPaymentHistory(userId: string): Promise<(IEnrollment & { course: any })[]> {
    return EnrollmentModel.find({ userId: userId ,}).sort({createdAt:-1})
      .populate<{ course: any }>("courseId","title thumbnail price")  
      .exec();
  }

   async countPaidByUser(userId: string): Promise<number> {
    return EnrollmentModel
      .countDocuments({ userId, status: "paid" })
      .exec();
  }

    async countDistinctPaidUsersInRange(range: { from: Date; to: Date }): Promise<number> {
    const ids = await EnrollmentModel.distinct("userId", {
      status: "paid",
      createdAt: { $gte: range.from, $lte: range.to }
    });
    return ids.length;
  }

  async sumPaidAmountInRange(range: { from: Date; to: Date }): Promise<number> {
    const res = await EnrollmentModel.aggregate<{ total: number }>([
      { $match: { status: "paid", createdAt: { $gte: range.from, $lte: range.to } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]).exec();
    return res[0]?.total ?? 0;
  }

  async sumPaidAmountToday(now: Date = new Date()): Promise<number> {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return this.sumPaidAmountInRange({ from: start, to: end });
  }

  async sumPaidAmountMonthToDate(now: Date = new Date()): Promise<number> {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return this.sumPaidAmountInRange({ from: start, to: now });
  }

  async countFailedLast24h(now: Date = new Date()): Promise<number> {
    const from = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return EnrollmentModel.countDocuments({
      status: "failed",
      createdAt: { $gte: from, $lte: now }
    }).exec();
  }

  async revenueSeries(
    range: { from: Date; to: Date },
    by: "daily" | "monthly"
  ): Promise<Array<{ period: string; value: number }>> {
    const format = by === "daily" ? "%Y-%m-%d" : "%Y-%m";
    const rows = await EnrollmentModel.aggregate<{ _id: string; value: number }>([
      { $match: { status: "paid", createdAt: { $gte: range.from, $lte: range.to } } },
      { $group: {
          _id: { $dateToString: { format, date: "$createdAt" } },
          value: { $sum: "$amount" }
      }},
      { $sort: { _id: 1 } }
    ]).exec();
    return rows.map(r => ({ period: r._id, value: r.value }));
  }

  async enrollmentSeries(
    range: { from: Date; to: Date },
    by: "daily" | "monthly"
  ): Promise<Array<{ period: string; value: number }>> {
    const format = by === "daily" ? "%Y-%m-%d" : "%Y-%m";
    const rows = await EnrollmentModel.aggregate<{ _id: string; value: number }>([
      { $match: { status: "paid", createdAt: { $gte: range.from, $lte: range.to } } },
      { $group: {
          _id: { $dateToString: { format, date: "$createdAt" } },
          value: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]).exec();
    return rows.map(r => ({ period: r._id, value: r.value }));
  }

  async topCoursesByPaid(
    range: { from: Date; to: Date },
    limit: number
  ): Promise<Array<{ courseId: string; enrollments: number; revenue: number }>> {
    const rows = await EnrollmentModel.aggregate<{ _id: any; enrollments: number; revenue: number }>([
      { $match: { status: "paid", createdAt: { $gte: range.from, $lte: range.to } } },
      { $group: {
          _id: "$courseId",
          enrollments: { $sum: 1 },
          revenue: { $sum: "$amount" }
      }},
      { $sort: { enrollments: -1, revenue: -1 } },
      { $limit: limit }
    ]).exec();

    return rows.map(r => ({
      courseId: String(r._id),
      enrollments: r.enrollments,
      revenue: r.revenue
    }));
  }
 
async sumPaidAmountForCourses(range: DateRange, courseIds: string[]): Promise<number> {
  if (!courseIds.length) return 0;
  const res = await EnrollmentModel.aggregate<{ total: number }>([
    { $match: matchPaid(range, courseIds) },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]).exec();
  return res[0]?.total ?? 0;
}

async revenueSeriesForCourses(range: DateRange, by: TimeGranularity, courseIds: string[]) {
  if (!courseIds.length) return [];
  const format = by === "daily" ? "%Y-%m-%d" : "%Y-%m";
  const rows = await EnrollmentModel.aggregate<{ _id: string; value: number }>([
    { $match: matchPaid(range, courseIds) },
    { $group: { _id: { $dateToString: { format, date: "$createdAt" } }, value: { $sum: "$amount" } } },
    { $sort: { _id: 1 } }
  ]).exec();
  return rows.map(r => ({ period: r._id, value: r.value }));
}

async enrollmentSeriesForCourses(range: DateRange, by: TimeGranularity, courseIds: string[]) {
  if (!courseIds.length) return [];
  const format = by === "daily" ? "%Y-%m-%d" : "%Y-%m";
  const rows = await EnrollmentModel.aggregate<{ _id: string; value: number }>([
    { $match: matchPaid(range, courseIds) },
    { $group: { _id: { $dateToString: { format, date: "$createdAt" } }, value: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]).exec();
  return rows.map(r => ({ period: r._id, value: r.value }));
}

async topCoursesByPaidForCourses(range: DateRange, courseIds: string[], limit: number) {
  if (!courseIds.length) return [];
  const rows = await EnrollmentModel.aggregate<{ _id: Types.ObjectId; enrollments: number; revenue: number }>([
    { $match: matchPaid(range, courseIds) },
    { $group: { _id: "$courseId", enrollments: { $sum: 1 }, revenue: { $sum: "$amount" } } },
    { $sort: { enrollments: -1, revenue: -1 } },
    { $limit: limit }
  ]).exec();
  return rows.map(r => ({ courseId: String(r._id), enrollments: r.enrollments, revenue: r.revenue }));
}

async countDistinctPaidUsersForCourses(range: DateRange, courseIds: string[]) {
  if (!courseIds.length) return 0;
  const ids = await EnrollmentModel.distinct("userId", matchPaid(range, courseIds));
  return ids.length;
}

async countPaidForCourses(range: DateRange, courseIds: string[]) {
  if (!courseIds.length) return 0;
  return EnrollmentModel.countDocuments(matchPaid(range, courseIds)).exec();
}

async countFailedLast24hForCourses(now: Date, courseIds: string[]) {
  if (!courseIds.length) return 0;
  const from = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  return EnrollmentModel.countDocuments({
    status: { $in: ["failed", "pending"] },
    courseId: { $in: toObjectIds(courseIds) },
    createdAt: { $gte: from, $lte: now }
  }).exec();
}

async recentPaidEnrollmentsForCourses(range: DateRange, courseIds: string[], limit: number) {
  if (!courseIds.length) return [];
  const docs = await EnrollmentModel.find(matchPaid(range, courseIds))
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate({ path: "userId", select: "name email" })
    .populate({ path: "courseId", select: "title code" })
    .lean()
    .exec();

  return docs.map((d: any) => ({
    date: new Date(d.createdAt).toISOString(),
    studentName: d.userId?.name ?? "",
    studentEmail: d.userId?.email ?? "",
    courseId: String(d.courseId?._id ?? d.courseId),
    courseTitle: d.courseId?.title ?? "",
    courseCode: d.courseId?.code ?? "",
    amount: d.amount,
  }));
}

}