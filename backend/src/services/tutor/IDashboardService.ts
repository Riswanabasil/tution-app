export type TimeGranularity = "daily" | "monthly";
export interface DateRange { from: Date; to: Date; }

export type CourseStatus = "pending" | "approved" | "rejected";

export interface TutorKpis {
  courses: Record<CourseStatus, number>;
  newEnrollments: number;          
  activeStudents: number;          
  revenue: { today: number; mtd: number; inRange: number };
  walletBalance: number;
  paymentIssues24h: number;    
}

export interface TrendPoint { period: string; value: number; }

export interface TopCourseRow {
  courseId: string;
  title: string;
  code: string;
  semester: number;
  enrollments: number;  
  revenue: number;   
}

export interface RecentEnrollmentRow {
  date: string;          
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  courseCode: string;
  amount: number;
}

export interface MyCourseRow {
  courseId: string;
  title: string;
  code: string;
  semester: number;
  status: CourseStatus;
  price: number;
  createdAt: Date;
  enrollmentsInRange: number;
  revenueInRange: number;
}

export interface ITutorDashboardService {
  getKpis(tutorId: string, range?: Partial<DateRange>): Promise<TutorKpis>;

  getRevenueTrend(
    tutorId: string,
    range: DateRange,
    granularity: TimeGranularity
  ): Promise<TrendPoint[]>;

  getEnrollmentTrend(
    tutorId: string,
    range: DateRange,
    granularity: TimeGranularity
  ): Promise<TrendPoint[]>;

  getTopCourses(
    tutorId: string,
    range: DateRange,
    limit?: number
  ): Promise<TopCourseRow[]>;

  getRecentEnrollments(
    tutorId: string,
    range: DateRange,
    limit?: number
  ): Promise<RecentEnrollmentRow[]>;

  getMyCoursesOverview(
    tutorId: string,
    range: DateRange,
    opts?: { status?: CourseStatus; limit?: number; skip?: number }
  ): Promise<{ items: MyCourseRow[]; total: number }>;

  getPendingApprovalsPreview(
    tutorId: string,
    limit?: number
  ): Promise<Array<{ courseId: string; title: string; code: string; semester: number; createdAt: Date }>>;
}
