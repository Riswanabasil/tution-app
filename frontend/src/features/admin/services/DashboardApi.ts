import { getAxios } from '../../../api/Axios';
const api = getAxios('admin');

export type TimeGranularity = 'daily' | 'monthly';
export type CourseStatus = 'pending' | 'approved' | 'rejected';
export type TutorStatus = 'pending' | 'verification-submitted' | 'approved' | 'rejected';

export type DateRange = { from: Date; to: Date };
export type TrendPoint = { period: string; value: number };

export type AdminKpis = {
  totalStudents: number;
  verifiedStudents: number;
  activeStudents: number;
  courses: Record<CourseStatus, number>;
  tutors: Record<TutorStatus, number>;
  revenue: { today: number; mtd: number; inRange: number };
  failedPayments24h: number;
};

export type TopCourseRow = {
  courseId: string;
  title: string;
  code: string;
  semester: number;
  tutorId: string;
  tutorName?: string;
  status: CourseStatus;
  enrollments: number;
  revenue: number;
};

export type PendingCourseListItem = {
  courseId: string;
  title: string;
  code: string;
  semester: number;
  tutorId: string;
  tutorName?: string;
  createdAt: string;
};

export type PendingTutorListItem = {
  tutorId: string;
  name: string;
  email: string;
  status: Extract<TutorStatus, 'pending' | 'verification-submitted'>;
  createdAt: string;
};

const toISO = (d: Date) => new Date(d).toISOString();

// API
export async function fetchKpis(range?: Partial<DateRange>) {
  const params = new URLSearchParams();
  if (range?.from) params.set('from', toISO(range.from));
  if (range?.to) params.set('to', toISO(range.to));
  const { data } = await api.get<AdminKpis>(
    `/admin/dashboard/kpis${params.toString() ? `?${params}` : ''}`,
  );
  return data;
}

export async function fetchRevenueTrend(range: DateRange, granularity: TimeGranularity) {
  const params = new URLSearchParams({
    from: toISO(range.from),
    to: toISO(range.to),
    granularity,
  });
  const { data } = await api.get<{ granularity: TimeGranularity; points: TrendPoint[] }>(
    `/admin/dashboard/revenue?${params.toString()}`,
  );
  return data.points;
}

export async function fetchEnrollmentTrend(range: DateRange, granularity: TimeGranularity) {
  const params = new URLSearchParams({
    from: toISO(range.from),
    to: toISO(range.to),
    granularity,
  });
  const { data } = await api.get<{ granularity: TimeGranularity; points: TrendPoint[] }>(
    `/admin/dashboard/enrollments?${params.toString()}`,
  );
  return data.points;
}

export async function fetchTopCourses(range: DateRange, limit = 5) {
  const params = new URLSearchParams({
    from: toISO(range.from),
    to: toISO(range.to),
    limit: String(limit),
  });
  const { data } = await api.get<{ limit: number; rows: TopCourseRow[] }>(
    `/admin/dashboard/top-courses?${params.toString()}`,
  );
  return data.rows;
}

export async function fetchApprovalQueues(limit = 10) {
  const params = new URLSearchParams({ limit: String(limit) });
  const { data } = await api.get<{
    limit: number;
    pendingCourses: PendingCourseListItem[];
    pendingTutors: PendingTutorListItem[];
  }>(`/admin/dashboard/approval-queues?${params.toString()}`);
  return { pendingCourses: data.pendingCourses, pendingTutors: data.pendingTutors };
}
