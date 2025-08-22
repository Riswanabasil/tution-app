
import type {
  ITutorDashboardService,
  TutorKpis,
  DateRange,
  TimeGranularity,
  TrendPoint,
  TopCourseRow,
  RecentEnrollmentRow,
  MyCourseRow,
  CourseStatus,
} from "../IDashboardService";

import type { ICourseRepository } from "../../../repositories/course/ICourseRepository";
import type { IEnrollmentRepository } from "../../../repositories/payment/IEnrollmentRepository";
import type { ITutorRepository } from "../../../repositories/tutor/ITutorRepository";

//  helpers 
function resolveRange(partial?: Partial<DateRange>): DateRange {
  const to = partial?.to ?? new Date();
  const from = partial?.from ?? new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000); 
  return { from, to };
}
function startOfToday(d = new Date()) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function startOfMonth(d = new Date()) { return new Date(d.getFullYear(), d.getMonth(), 1); }

export class TutorDashboardService implements ITutorDashboardService {
  constructor(
    private readonly courses: ICourseRepository,
    private readonly enrollments: IEnrollmentRepository,
    private readonly tutors: ITutorRepository
  ) {}

  //  KPIs 
  async getKpis(tutorId: string, range?: Partial<DateRange>): Promise<TutorKpis> {
    const r = resolveRange(range);
    const [statusMap, approvedCourseIds, allCourseIds] = await Promise.all([
      this.courses.countByStatusForTutor(tutorId),
      this.courses.listIdsByTutor(tutorId, ["approved"]),
      this.courses.listIdsByTutor(tutorId), 
    ]);

    const now = new Date();
    const todayRange: DateRange = { from: startOfToday(now), to: now };
    const mtdRange: DateRange = { from: startOfMonth(now), to: now };

    const [
      newEnrollments,
      activeStudents,
      revInRange,
      revToday,
      revMtd,
      walletBalance,
      paymentIssues24h,
    ] = await Promise.all([
      this.enrollments.countPaidForCourses(r, approvedCourseIds),
      this.enrollments.countDistinctPaidUsersForCourses(r, approvedCourseIds),
      this.enrollments.sumPaidAmountForCourses(r, approvedCourseIds),
      this.enrollments.sumPaidAmountForCourses(todayRange, approvedCourseIds),
      this.enrollments.sumPaidAmountForCourses(mtdRange, approvedCourseIds),
      this.tutors.getWalletBalance(tutorId),
      this.enrollments.countFailedLast24hForCourses(now, approvedCourseIds),
    ]);

    return {
      courses: {
        pending: statusMap.pending ?? 0,
        approved: statusMap.approved ?? 0,
        rejected: statusMap.rejected ?? 0,
      },
      newEnrollments,
      activeStudents,
      revenue: { today: revToday, mtd: revMtd, inRange: revInRange },
      walletBalance,
      paymentIssues24h,
    };
  }

  // ---------- Charts ----------
  async getRevenueTrend(
    tutorId: string,
    range: DateRange,
    granularity: TimeGranularity
  ): Promise<TrendPoint[]> {
    const courseIds = await this.courses.listIdsByTutor(tutorId, ["approved"]);
    return this.enrollments.revenueSeriesForCourses(range, granularity, courseIds);
  }

  async getEnrollmentTrend(
    tutorId: string,
    range: DateRange,
    granularity: TimeGranularity
  ): Promise<TrendPoint[]> {
    const courseIds = await this.courses.listIdsByTutor(tutorId, ["approved"]);
    return this.enrollments.enrollmentSeriesForCourses(range, granularity, courseIds);
  }

  // ---------- Top courses table ----------
  async getTopCourses(
    tutorId: string,
    range: DateRange,
    limit = 5
  ): Promise<TopCourseRow[]> {
    const courseIds = await this.courses.listIdsByTutor(tutorId, ["approved"]);
    if (!courseIds.length) return [];

    const stats = await this.enrollments.topCoursesByPaidForCourses(range, courseIds, limit);
    if (stats.length === 0) return [];

    const ids = stats.map(s => s.courseId);
    const courses = await this.courses.findByIds(ids);
    const byId = new Map(courses.map((c: any) => [String(c._id), c]));

    return stats.map(s => {
      const c = byId.get(s.courseId);
      return {
        courseId: s.courseId,
        title: c?.title ?? "(deleted)",
        code: c?.code ?? "-",
        semester: c?.semester ?? 0,
        enrollments: s.enrollments,
        revenue: s.revenue,
      };
    });
  }

  // ---------- Recent enrollments table ----------
  async getRecentEnrollments(
    tutorId: string,
    range: DateRange,
    limit = 20
  ): Promise<RecentEnrollmentRow[]> {
    const courseIds = await this.courses.listIdsByTutor(tutorId, ["approved"]);
    if (!courseIds.length) return [];
    return this.enrollments.recentPaidEnrollmentsForCourses(range, courseIds, limit);
  }

  // ---------- My courses overview----------
  async getMyCoursesOverview(
    tutorId: string,
    range: DateRange,
    opts?: { status?: CourseStatus; limit?: number; skip?: number }
  ): Promise<{ items: MyCourseRow[]; total: number }> {
    const list = await this.courses.listByTutor(tutorId, {
      status: opts?.status,
      limit: opts?.limit ?? 50,
      skip: opts?.skip ?? 0,
    });
    const totalFilter: any = { tutor: tutorId };
    if (opts?.status) totalFilter.status = opts.status;
    const total = await this.courses.countDocuments(totalFilter);

    const ids = list.map(c => String(c._id));
    if (!ids.length) return { items: [], total };
    const stats = await this.enrollments.topCoursesByPaidForCourses(range, ids, ids.length);
    const statMap = new Map(stats.map(s => [s.courseId, s]));

    const items: MyCourseRow[] = list.map(c => {
      const s = statMap.get(String(c._id));
      return {
        courseId: String(c._id),
        title: c.title,
        code: c.code,
        semester: c.semester,
        status: c.status as CourseStatus,
        price: c.price,
        createdAt: c.createdAt as Date,
        enrollmentsInRange: s?.enrollments ?? 0,
        revenueInRange: s?.revenue ?? 0,
      };
    });

    return { items, total };
  }

  // ---------- Pending approvals preview ----------
  async getPendingApprovalsPreview(
    tutorId: string,
    limit = 6
  ): Promise<Array<{ courseId: string; title: string; code: string; semester: number; createdAt: Date }>> {
    const rows = await this.courses.listPendingForTutor(tutorId, limit);
    return rows.map(r => ({
      courseId: String(r._id),
      title: r.title,
      code: r.code,
      semester: r.semester,
      createdAt: r.createdAt,
    }));
  }
}
