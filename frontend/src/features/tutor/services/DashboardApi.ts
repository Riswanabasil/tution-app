import { getAxios } from "../../../api/Axios";
const api = getAxios("tutor");

export type TimeGranularity = "daily" | "monthly";
export type CourseStatus = "pending" | "approved" | "rejected";

export type DateRange = { from: Date; to: Date };
export const toISO = (d: Date) => new Date(d).toISOString();

export type TrendPoint = { period: string; value: number };

export type TutorKpis = {
  courses: Record<CourseStatus, number>;
  newEnrollments: number;
  activeStudents: number;
  revenue: { today: number; mtd: number; inRange: number };
  walletBalance: number;
  paymentIssues24h: number;
};

export type TopCourseRow = {
  courseId: string;
  title: string;
  code: string;
  semester: number;
  enrollments: number;
  revenue: number;
};

export type RecentEnrollmentRow = {
  date: string; 
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  courseCode: string;
  amount: number;
};

export type MyCourseRow = {
  courseId: string;
  title: string;
  code: string;
  semester: number;
  status: CourseStatus;
  price: number;
  createdAt: string; 
  enrollmentsInRange: number;
  revenueInRange: number;
};

// ---------- API calls ----------
export async function fetchTutorKpis(range?: Partial<DateRange>) {
  const params = new URLSearchParams();
  if (range?.from) params.set("from", toISO(range.from));
  if (range?.to) params.set("to", toISO(range.to));
  const { data } = await api.get<TutorKpis>(
    `/tutor/dashboard/kpis${params.toString() ? `?${params}` : ""}`
  );
  return data;
}

export async function fetchTutorRevenueTrend(range: DateRange, granularity: TimeGranularity) {
  const params = new URLSearchParams({
    from: toISO(range.from),
    to: toISO(range.to),
    granularity,
  });
  const { data } = await api.get<{ granularity: TimeGranularity; points: TrendPoint[] }>(
    `/tutor/dashboard/revenue?${params.toString()}`
  );
  return data.points;
}

export async function fetchTutorEnrollmentTrend(range: DateRange, granularity: TimeGranularity) {
  const params = new URLSearchParams({
    from: toISO(range.from),
    to: toISO(range.to),
    granularity,
  });
  const { data } = await api.get<{ granularity: TimeGranularity; points: TrendPoint[] }>(
    `/tutor/dashboard/enrollments?${params.toString()}`
  );
  return data.points;
}

export async function fetchTutorTopCourses(range: DateRange, limit = 5) {
  const params = new URLSearchParams({
    from: toISO(range.from),
    to: toISO(range.to),
    limit: String(limit),
  });
  const { data } = await api.get<{ limit: number; rows: TopCourseRow[] }>(
    `/tutor/dashboard/top-courses?${params.toString()}`
  );
  return data.rows;
}

export async function fetchTutorRecentEnrollments(range: DateRange, limit = 20) {
  const params = new URLSearchParams({
    from: toISO(range.from),
    to: toISO(range.to),
    limit: String(limit),
  });
  const { data } = await api.get<{ limit: number; rows: RecentEnrollmentRow[] }>(
    `/tutor/dashboard/recent-enrollments?${params.toString()}`
  );
  return data.rows;
}

export async function fetchTutorMyCourses(
  range: DateRange,
  opts?: { status?: CourseStatus; limit?: number; skip?: number }
) {
  const params = new URLSearchParams({
    from: toISO(range.from),
    to: toISO(range.to),
  });
  if (opts?.status) params.set("status", opts.status);
  if (opts?.limit != null) params.set("limit", String(opts.limit));
  if (opts?.skip != null) params.set("skip", String(opts.skip));

  const { data } = await api.get<{ items: MyCourseRow[]; total: number }>(
    `/tutor/dashboard/my-courses?${params.toString()}`
  );
  return data;
}

export async function fetchTutorPendingApprovals(limit = 6) {
  const params = new URLSearchParams({ limit: String(limit) });
  const { data } = await api.get<{ limit: number; rows: Array<{ courseId: string; title: string; code: string; semester: number; createdAt: string }> }>(
    `/tutor/dashboard/pending-approvals?${params.toString()}`
  );
  return data.rows;
}
