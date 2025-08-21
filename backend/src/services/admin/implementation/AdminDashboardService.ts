import type {
  IAdminDashboardService, AdminKpis, DateRange, TimeGranularity,
  TrendPoint, TopCourseRow, PendingCourseListItem, PendingTutorListItem,
  CourseStatus, TutorStatus
} from "../IAdminDashboardService";

import type { IStudentRepository } from "../../../repositories/student/IStudentRepository";
import type { ITutorRepository } from "../../../repositories/tutor/ITutorRepository";
import type { ICourseRepository } from "../../../repositories/course/ICourseRepository";
import type { IEnrollmentRepository } from "../../../repositories/payment/IEnrollmentRepository";

function resolveRange(partial?: Partial<DateRange>): DateRange {
  const to = partial?.to ?? new Date();
  const from = partial?.from ?? new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
  return { from, to };
}
function startOfToday(d = new Date()) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function startOfMonth(d = new Date()) { return new Date(d.getFullYear(), d.getMonth(), 1); }

export class AdminDashboardService implements IAdminDashboardService {
  constructor(
    private readonly students: IStudentRepository,
    private readonly tutors: ITutorRepository,
    private readonly courses: ICourseRepository,
    private readonly enrollments: IEnrollmentRepository
  ) {}

  async getKpis(range?: Partial<DateRange>): Promise<AdminKpis> {
    const r = resolveRange(range);
    const [
      totalStudents,
      verifiedStudents,
      activeStudents,
      courseStatusMap,
      tutorStatusMap,
      revenueInRange,
      revenueToday,
      revenueMtd,
      failedPayments24h,
    ] = await Promise.all([
      this.students.countAll(),
      this.students.countVerified(),
      this.enrollments.countDistinctPaidUsersInRange(r),
      this.courses.countByStatusMap(),
      this.tutors.countByStatusMap(),
      this.enrollments.sumPaidAmountInRange(r),
      this.enrollments.sumPaidAmountToday(startOfToday()),
      this.enrollments.sumPaidAmountMonthToDate(startOfMonth()),
      this.enrollments.countFailedLast24h(),
    ]);

    const tutors: Record<TutorStatus, number> = {
      pending: tutorStatusMap["pending"] ?? 0,
      "verification-submitted": tutorStatusMap["verification-submitted"] ?? 0,
      approved: tutorStatusMap["approved"] ?? 0,
      rejected: tutorStatusMap["rejected"] ?? 0,
    };

    const courses: Record<CourseStatus, number> = {
      pending: courseStatusMap["pending"] ?? 0,
      approved: courseStatusMap["approved"] ?? 0,
      rejected: courseStatusMap["rejected"] ?? 0,
    };

    return {
      totalStudents,
      verifiedStudents,
      activeStudents,
      courses,
      tutors,
      revenue: { today: revenueToday, mtd: revenueMtd, inRange: revenueInRange },
      failedPayments24h,
    };
  }

  getRevenueTrend(range: DateRange, granularity: TimeGranularity): Promise<TrendPoint[]> {
    return this.enrollments.revenueSeries(range, granularity);
  }

  getEnrollmentTrend(range: DateRange, granularity: TimeGranularity): Promise<TrendPoint[]> {
    return this.enrollments.enrollmentSeries(range, granularity);
  }

  async getTopCourses(range: DateRange, limit = 5): Promise<TopCourseRow[]> {
    const top = await this.enrollments.topCoursesByPaid(range, limit);
    if (top.length === 0) return [];

    const courseIds = top.map(t => t.courseId);
    const courseDocs = await this.courses.findByIds(courseIds);
    const tutorIds = Array.from(new Set(courseDocs.map(c => String(c.tutor))));
    const tutorDocs = await this.tutors.findByIds(tutorIds);

    const tutorNameMap = new Map(tutorDocs.map(t => [String(t._id), t.name]));
    const courseMap = new Map(courseDocs.map(c => [String(c._id), c]));

    return top.map(row => {
      const c = courseMap.get(row.courseId);
      return {
        courseId: row.courseId,
        title: c?.title ?? "(deleted)",
        code: c?.code ?? "-",
        semester: c?.semester ?? 0,
        tutorId: String(c?.tutor ?? ""),
        tutorName: c?.tutor ? tutorNameMap.get(String(c.tutor)) : undefined,
        status: (c?.status ?? "rejected") as CourseStatus,
        enrollments: row.enrollments,
        revenue: row.revenue
      };
    });
  }

  async getApprovalQueues(limit = 10): Promise<{ pendingCourses: PendingCourseListItem[]; pendingTutors: PendingTutorListItem[]; }> {
    const [courses, tutors] = await Promise.all([
      this.courses.listByStatus("pending", limit),
      this.tutors.listByStatuses(["pending", "verification-submitted"], limit),
    ]);

    const tutorIds = Array.from(new Set(courses.map(c => String(c.tutor))));
    const tutorDocs = tutorIds.length ? await this.tutors.findByIds(tutorIds) : [];
    const tutorMap = new Map(tutorDocs.map(t => [String(t._id), t.name]));

    const pendingCourses: PendingCourseListItem[] = courses.map(c => ({
      courseId: String(c._id),
      title: c.title,
      code: c.code,
      semester: c.semester,
      tutorId: String(c.tutor),
      tutorName: tutorMap.get(String(c.tutor)),
      createdAt: c.createdAt,
    }));

    const pendingTutors: PendingTutorListItem[] = tutors.map(t => ({
      tutorId: String(t._id),
      name: t.name,
      email: t.email,
      status: t.status as Extract<TutorStatus, "pending" | "verification-submitted">,
      createdAt: t.createdAt,
    }));

    return { pendingCourses, pendingTutors };
  }
}
