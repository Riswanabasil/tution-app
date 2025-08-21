export type TimeGranularity = "daily" | "monthly";
export interface DateRange { from: Date; to: Date; }
export type CourseStatus = "pending" | "approved" | "rejected";
export type TutorStatus = "pending" | "verification-submitted" | "approved" | "rejected";

export interface AdminKpis {
  totalStudents: number;
  verifiedStudents: number;
  activeStudents: number;
  courses: Record<CourseStatus, number>;
  tutors: Record<TutorStatus, number>;
  revenue: { today: number; mtd: number; inRange: number; };
  failedPayments24h: number;
}

export interface TrendPoint { period: string; value: number; }
export interface TopCourseRow {
  courseId: string; title: string; code: string; semester: number;
  tutorId: string; tutorName?: string; status: CourseStatus;
  enrollments: number; revenue: number;
}

export interface PendingCourseListItem {
  courseId: string; title: string; code: string; semester: number;
  tutorId: string; tutorName?: string; createdAt: Date;
}
export interface PendingTutorListItem {
  tutorId: string; name: string; email: string;
  status: Extract<TutorStatus, "pending" | "verification-submitted">; createdAt: Date;
}

export interface IAdminDashboardService {
  getKpis(range?: Partial<DateRange>): Promise<AdminKpis>;
  getRevenueTrend(range: DateRange, granularity: TimeGranularity): Promise<TrendPoint[]>;
  getEnrollmentTrend(range: DateRange, granularity: TimeGranularity): Promise<TrendPoint[]>;
  getTopCourses(range: DateRange, limit?: number): Promise<TopCourseRow[]>;
  getApprovalQueues(limit?: number): Promise<{ pendingCourses: PendingCourseListItem[]; pendingTutors: PendingTutorListItem[]; }>;
}
