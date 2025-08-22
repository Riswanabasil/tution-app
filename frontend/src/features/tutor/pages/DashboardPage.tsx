import { useEffect, useMemo, useState } from "react";
import {
  fetchTutorKpis,
  fetchTutorRevenueTrend,
  fetchTutorEnrollmentTrend,
  fetchTutorTopCourses,
  fetchTutorRecentEnrollments,
  fetchTutorMyCourses,
  fetchTutorPendingApprovals,
  type TimeGranularity,
  type TrendPoint,
  type TutorKpis,
  type TopCourseRow,
  type RecentEnrollmentRow,
  type MyCourseRow,
  type CourseStatus,
} from "../services/DashboardApi";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar,
} from "recharts";

// ---- date helpers ----
type PresetRange = "7d" | "30d" | "90d";
const computeRange = (preset: PresetRange) => {
  const to = new Date();
  const days = preset === "7d" ? 7 : preset === "30d" ? 30 : 90;
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
  return { from, to };
};

// ---- small ui bits ----
function KpiCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-white via-gray-50/50 to-white p-6 shadow-lg shadow-gray-100/50 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative">
        <div className="text-sm font-medium text-gray-600">{label}</div>
        <div className="mt-2 text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">{value}</div>
        {sub && <div className="mt-2 text-xs text-gray-500 font-medium">{sub}</div>}
      </div>
    </div>
  );
}

function TrendBlock({ title, data, kind = "line" }: { title: string; data: TrendPoint[]; kind?: "line" | "bar" }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-white via-gray-50/30 to-white p-6 shadow-lg shadow-gray-100/50 backdrop-blur-sm">
      <div className="mb-4 text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{title}</div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {kind === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.6} />
              <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '16px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="url(#lineGradient)" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} 
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
              />
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.6} />
              <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '16px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                }} 
              />
              <Bar dataKey="value" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function TopCoursesTable({ rows }: { rows: TopCourseRow[] }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-white via-gray-50/30 to-white p-6 shadow-lg shadow-gray-100/50 backdrop-blur-sm">
      <div className="mb-6 text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Top Courses (by sales)</div>
      <div className="overflow-hidden rounded-2xl border border-gray-100">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
            <tr>
              <th className="p-4 text-left font-semibold text-gray-700">Course</th>
              <th className="p-4 text-left font-semibold text-gray-700">Semester</th>
              <th className="p-4 text-left font-semibold text-gray-700">Enrollments</th>
              <th className="p-4 text-left font-semibold text-gray-700">Revenue</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {rows.map((r, index) => (
              <tr key={r.courseId} className={`transition-colors hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 ${index < rows.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <td className="p-4">
                  <div className="font-semibold text-gray-900">{r.title}</div>
                  <div className="text-xs text-gray-500 mt-1 font-medium">{r.code}</div>
                </td>
                <td className="p-4 font-medium text-gray-700">{r.semester}</td>
                <td className="p-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {r.enrollments}
                  </span>
                </td>
                <td className="p-4 font-bold text-green-600">₹{r.revenue.toLocaleString()}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={4}>
                  No data for selected range.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RecentEnrollmentsTable({ rows }: { rows: RecentEnrollmentRow[] }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-white via-gray-50/30 to-white p-6 shadow-lg shadow-gray-100/50 backdrop-blur-sm">
      <div className="mb-6 text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Recent Enrollments</div>
      <div className="overflow-hidden rounded-2xl border border-gray-100">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
            <tr>
              <th className="p-4 text-left font-semibold text-gray-700">Date</th>
              <th className="p-4 text-left font-semibold text-gray-700">Student</th>
              <th className="p-4 text-left font-semibold text-gray-700">Course</th>
              <th className="p-4 text-left font-semibold text-gray-700">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {rows.map((r, i) => (
              <tr key={i} className={`transition-colors hover:bg-gradient-to-r hover:from-green-50/50 hover:to-blue-50/50 ${i < rows.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <td className="p-4 font-medium text-gray-600">{new Date(r.date).toLocaleDateString()}</td>
                <td className="p-4">
                  <div className="font-semibold text-gray-900">{r.studentName || "—"}</div>
                  <div className="text-xs text-gray-500 mt-1">{r.studentEmail || ""}</div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-gray-900">{r.courseTitle}</div>
                  <div className="text-xs text-gray-500 mt-1 font-medium">{r.courseCode}</div>
                </td>
                <td className="p-4 font-bold text-green-600">₹{r.amount.toLocaleString()}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={4}>
                  No enrollments in this range.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MyCoursesOverview({
  items,
  total,
  page,
  pageSize,
  onPageChange,
}: {
  items: MyCourseRow[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-white via-gray-50/30 to-white p-6 shadow-lg shadow-gray-100/50 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">My Courses Overview</div>
        <div className="flex items-center gap-3 text-sm">
          <button
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 font-medium shadow-sm transition-all duration-200 hover:shadow-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
          >
            Prev
          </button>
          <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 font-semibold">
            {page}/{totalPages}
          </span>
          <button
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 font-medium shadow-sm transition-all duration-200 hover:shadow-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
            <tr>
              <th className="p-4 text-left font-semibold text-gray-700">Course</th>
              <th className="p-4 text-left font-semibold text-gray-700">Semester</th>
              <th className="p-4 text-left font-semibold text-gray-700">Status</th>
              <th className="p-4 text-left font-semibold text-gray-700">Price</th>
              <th className="p-4 text-left font-semibold text-gray-700">Enrollments (range)</th>
              <th className="p-4 text-left font-semibold text-gray-700">Revenue (range)</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {items.map((c) => (
              <tr key={c.courseId} className="transition-colors hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 border-b border-gray-100 last:border-b-0">
                <td className="p-4">
                  <div className="font-semibold text-gray-900">{c.title}</div>
                  <div className="text-xs text-gray-500 mt-1 font-medium">{c.code}</div>
                </td>
                <td className="p-4 font-medium text-gray-700">{c.semester}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                    c.status === 'approved' ? 'bg-green-100 text-green-800' :
                    c.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="p-4 font-bold text-blue-600">₹{c.price.toLocaleString()}</td>
                <td className="p-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                    {c.enrollmentsInRange}
                  </span>
                </td>
                <td className="p-4 font-bold text-green-600">₹{c.revenueInRange.toLocaleString()}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={6}>
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---- main page ----
export default function TutorDashboardPage() {
  const [preset, setPreset] = useState<PresetRange>("30d");
  const [granularity, setGranularity] = useState<TimeGranularity>("daily");
  const [statusFilter, setStatusFilter] = useState<CourseStatus | "all">("all");

  const range = useMemo(() => computeRange(preset), [preset]);

  const [kpis, setKpis] = useState<TutorKpis | null>(null);
  const [rev, setRev] = useState<TrendPoint[]>([]);
  const [enr, setEnr] = useState<TrendPoint[]>([]);
  const [top, setTop] = useState<TopCourseRow[]>([]);
  const [recent, setRecent] = useState<RecentEnrollmentRow[]>([]);
  const [pending, setPending] = useState<Array<{ courseId: string; title: string; code: string; semester: number; createdAt: string }>>([]);

  // courses overview pagination
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [overview, setOverview] = useState<{ items: MyCourseRow[]; total: number }>({ items: [], total: 0 });

  const refreshAll = () => {
    Promise.all([
      fetchTutorKpis(range),
      fetchTutorRevenueTrend(range, granularity),
      fetchTutorEnrollmentTrend(range, "monthly"),
      fetchTutorTopCourses(range, 5),
      fetchTutorRecentEnrollments(range, 20),
      fetchTutorPendingApprovals(6),
      fetchTutorMyCourses(range, {
        status: statusFilter === "all" ? undefined : statusFilter,
        limit: pageSize,
        skip: (page - 1) * pageSize,
      }),
    ]).then(([k, r, e, t, re, p, ov]) => {
      setKpis(k);
      setRev(r);
      setEnr(e);
      setTop(t);
      setRecent(re);
      setPending(p);
      setOverview(ov);
    });
  };

  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset, granularity, statusFilter, page]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Tutor Dashboard
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur px-4 py-2.5 text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                value={preset}
                onChange={(e) => { setPage(1); setPreset(e.target.value as PresetRange); }}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>

              <select
                className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur px-4 py-2.5 text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                value={granularity}
                onChange={(e) => setGranularity(e.target.value as TimeGranularity)}
              >
                <option value="daily">Daily revenue</option>
                <option value="monthly">Monthly revenue</option>
              </select>

              <select
                className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur px-4 py-2.5 text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                value={statusFilter}
                onChange={(e) => { setPage(1); setStatusFilter(e.target.value as any); }}
              >
                <option value="all">All courses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* KPI strip */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
          <KpiCard label="Approved Courses" value={kpis?.courses.approved ?? 0} />
          <KpiCard label="Pending Courses" value={kpis?.courses.pending ?? 0} />
          <KpiCard label="Rejected Courses" value={kpis?.courses.rejected ?? 0} />
          <KpiCard label="New Enrollments" value={kpis?.newEnrollments ?? 0} />
          <KpiCard
            label="Revenue (MTD)"
            value={`₹${(kpis?.revenue.mtd ?? 0).toLocaleString()}`}
            sub={`Today: ₹${(kpis?.revenue.today ?? 0).toLocaleString()}`}
          />
        </div>

        {/* wallet + issues */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-green-50 via-emerald-50/50 to-teal-50 p-6 shadow-lg shadow-green-100/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-200/60 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="text-sm font-medium text-green-700">Wallet Balance</div>
              <div className="mt-2 text-3xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">₹{(kpis?.walletBalance ?? 0).toLocaleString()}</div>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50 p-6 shadow-lg shadow-blue-100/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-200/60 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="text-sm font-medium text-blue-700">Active Students (range)</div>
              <div className="mt-2 text-3xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent">{kpis?.activeStudents ?? 0}</div>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-orange-50 via-red-50/50 to-pink-50 p-6 shadow-lg shadow-orange-100/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-200/60 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="text-sm font-medium text-orange-700">Payment Issues (24h)</div>
              <div className="mt-2 text-3xl font-bold bg-gradient-to-r from-orange-700 via-red-600 to-pink-600 bg-clip-text text-transparent">{kpis?.paymentIssues24h ?? 0}</div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TrendBlock title={`Revenue (${granularity})`} data={rev} kind="line" />
          <TrendBlock title="Enrollments (monthly)" data={enr} kind="bar" />
        </div>

        {/* Top courses */}
        <TopCoursesTable rows={top} />

        {/* Recent enrollments */}
        <RecentEnrollmentsTable rows={recent} />

        {/* My courses overview + pagination */}
        <MyCoursesOverview
          items={overview.items}
          total={overview.total}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
        />

        {/* Pending approvals preview */}
        <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30 p-6 shadow-lg shadow-yellow-100/50 backdrop-blur-sm">
          <div className="mb-6 text-lg font-semibold bg-gradient-to-r from-yellow-700 to-orange-600 bg-clip-text text-transparent">Pending Approvals</div>
          <div className="space-y-4">
            {pending.map((c) => (
              <div key={c.courseId} className="flex items-center justify-between p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-yellow-100 hover:bg-white/80 transition-all duration-200 hover:shadow-md">
                <div>
                  <div className="font-semibold text-gray-900">{c.title}</div>
                  <div className="text-xs text-gray-600 mt-1 font-medium">
                    {c.code} • Sem {c.semester}
                  </div>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
            {pending.length === 0 && (
              <div className="text-center py-8 text-gray-500 bg-white/40 rounded-2xl backdrop-blur-sm">
                No pending courses
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}