import { CourseStatus, DateRange, MyCourseRow, RecentEnrollmentRow, TimeGranularity, TopCourseRow, TrendPoint, TutorKpis } from "../../utils/dashboardTutor";


export interface ITutorDashboardService {
  getKpis(tutorId: string, range?: Partial<DateRange>): Promise<TutorKpis>;

  getRevenueTrend(
    tutorId: string,
    range: DateRange,
    granularity: TimeGranularity,
  ): Promise<TrendPoint[]>;

  getEnrollmentTrend(
    tutorId: string,
    range: DateRange,
    granularity: TimeGranularity,
  ): Promise<TrendPoint[]>;

  getTopCourses(tutorId: string, range: DateRange, limit?: number): Promise<TopCourseRow[]>;

  getRecentEnrollments(
    tutorId: string,
    range: DateRange,
    limit?: number,
  ): Promise<RecentEnrollmentRow[]>;

  getMyCoursesOverview(
    tutorId: string,
    range: DateRange,
    opts?: { status?: CourseStatus; limit?: number; skip?: number },
  ): Promise<{ items: MyCourseRow[]; total: number }>;

  getPendingApprovalsPreview(
    tutorId: string,
    limit?: number,
  ): Promise<
    Array<{ courseId: string; title: string; code: string; semester: number; createdAt: Date }>
  >;
}
