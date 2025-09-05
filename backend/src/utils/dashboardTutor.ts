// import { DateRange } from "../services/tutor/IDashboardService";

import { Request } from 'express';

// export function resolveRange(partial?: Partial<DateRange>): DateRange {
//   const to = partial?.to ?? new Date();
//   const from = partial?.from ?? new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
//   return { from, to };
// }
// export function startOfToday(d = new Date()) {
//   return new Date(d.getFullYear(), d.getMonth(), d.getDate());
// }
// export function startOfMonth(d = new Date()) {
//   return new Date(d.getFullYear(), d.getMonth(), 1);
// }
export type TimeGranularity = 'daily' | 'monthly';
export interface DateRange {
  from: Date;
  to: Date;
}

export type CourseStatus = 'pending' | 'approved' | 'rejected';

export interface TutorKpis {
  courses: Record<CourseStatus, number>;
  newEnrollments: number;
  activeStudents: number;
  revenue: { today: number; mtd: number; inRange: number };
  walletBalance: number;
  paymentIssues24h: number;
}

export interface TrendPoint {
  period: string;
  value: number;
}

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

function parseDateRange(q: Request['query']): DateRange {
  const to = q.to ? new Date(String(q.to)) : new Date();
  const from = q.from
    ? new Date(String(q.from))
    : new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
  return { from, to };
}

function parseGranularity(v: unknown, fallback: TimeGranularity): TimeGranularity {
  return v === 'monthly' || v === 'daily' ? v : fallback;
}

function parseLimit(v: unknown, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.min(n, 100) : fallback;
}
