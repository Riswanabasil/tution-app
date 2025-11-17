// import { useEffect, useMemo, useState } from 'react';
// import {
//   fetchKpis,
//   fetchRevenueTrend,
//   fetchEnrollmentTrend,
//   fetchTopCourses,
//   fetchApprovalQueues,
//   type AdminKpis,
//   type TrendPoint,
//   type TopCourseRow,
//   type PendingCourseListItem,
//   type PendingTutorListItem,
//   type TimeGranularity,
// } from '../services/DashboardApi';

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   Legend,
// } from 'recharts';

// // ----- small date helpers -----
// type PresetRange = '7d' | '30d' | '90d';
// const computeRange = (preset: PresetRange) => {
//   const to = new Date();
//   const days = preset === '7d' ? 7 : preset === '30d' ? 30 : 90;
//   const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
//   return { from, to };
// };

// // ----- KPI card -----
// function KpiCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
//   return (
//     <div className="rounded-2xl border bg-white p-5 shadow-sm">
//       <div className="text-sm text-gray-500">{label}</div>
//       <div className="mt-1 text-3xl font-semibold text-gray-900">{value}</div>
//       {sub && <div className="mt-1 text-xs text-gray-500">{sub}</div>}
//     </div>
//   );
// }

// // ----- Trend chart (generic) -----
// function TrendBlock({
//   title,
//   data,
//   kind = 'line',
// }: {
//   title: string;
//   data: TrendPoint[];
//   kind?: 'line' | 'bar';
// }) {
//   return (
//     <div className="rounded-2xl border bg-white p-4 shadow-sm">
//       <div className="mb-3 font-medium text-gray-800">{title}</div>
//       <div className="h-64">
//         <ResponsiveContainer width="100%" height="100%">
//           {kind === 'line' ? (
//             <LineChart data={data}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="period" tick={{ fontSize: 12 }} />
//               <YAxis tick={{ fontSize: 12 }} />
//               <Tooltip />
//               <Line type="monotone" dataKey="value" dot={false} />
//             </LineChart>
//           ) : (
//             <BarChart data={data}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="period" tick={{ fontSize: 12 }} />
//               <YAxis tick={{ fontSize: 12 }} />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="value" />
//             </BarChart>
//           )}
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }

// // ----- Tables -----
// function TopCoursesTable({ rows }: { rows: TopCourseRow[] }) {
//   return (
//     <div className="rounded-2xl border bg-white p-4 shadow-sm">
//       <div className="mb-3 font-medium text-gray-800">Top 5 Most-Sold Courses</div>
//       <div className="overflow-x-auto">
//         <table className="min-w-full text-sm">
//           <thead className="bg-gray-50 text-left text-gray-600">
//             <tr>
//               <th className="p-3">Course</th>
//               <th className="p-3">Tutor</th>
//               <th className="p-3">Semester</th>
//               <th className="p-3">Enrollments</th>
//               <th className="p-3">Revenue</th>
//               <th className="p-3">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((r) => (
//               <tr key={r.courseId} className="border-t">
//                 <td className="p-3">
//                   <div className="font-medium">{r.title}</div>
//                   <div className="text-xs text-gray-500">{r.code}</div>
//                 </td>
//                 <td className="p-3">{r.tutorName ?? '—'}</td>
//                 <td className="p-3">{r.semester}</td>
//                 <td className="p-3">{r.enrollments}</td>
//                 <td className="p-3">₹{r.revenue.toLocaleString()}</td>
//                 <td className="p-3">
//                   <span className="rounded-full bg-gray-100 px-2 py-1 text-xs capitalize text-gray-700">
//                     {r.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//             {rows.length === 0 && (
//               <tr>
//                 <td className="p-3 text-gray-500" colSpan={6}>
//                   No data for selected range.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// function ApprovalQueues({
//   pendingCourses,
//   pendingTutors,
// }: {
//   pendingCourses: PendingCourseListItem[];
//   pendingTutors: PendingTutorListItem[];
// }) {
//   return (
//     <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
//       <div className="rounded-2xl border bg-white p-4 shadow-sm">
//         <div className="mb-3 font-medium text-gray-800">Pending Course Approvals</div>
//         <ul className="space-y-3">
//           {pendingCourses.map((c) => (
//             <li key={c.courseId} className="flex items-center justify-between">
//               <div>
//                 <div className="font-medium">{c.title}</div>
//                 <div className="text-xs text-gray-500">
//                   {c.code} • Sem {c.semester} • {c.tutorName ?? 'Tutor'}
//                 </div>
//               </div>
//               <span className="text-xs text-gray-400">
//                 {new Date(c.createdAt).toLocaleDateString()}
//               </span>
//             </li>
//           ))}
//           {pendingCourses.length === 0 && (
//             <div className="text-sm text-gray-500">No pending courses</div>
//           )}
//         </ul>
//       </div>

//       <div className="rounded-2xl border bg-white p-4 shadow-sm">
//         <div className="mb-3 font-medium text-gray-800">Pending Tutor Verifications</div>
//         <ul className="space-y-3">
//           {pendingTutors.map((t) => (
//             <li key={t.tutorId} className="flex items-center justify-between">
//               <div>
//                 <div className="font-medium">{t.name}</div>
//                 <div className="text-xs text-gray-500">
//                   {t.email} • {t.status}
//                 </div>
//               </div>
//               <span className="text-xs text-gray-400">
//                 {new Date(t.createdAt).toLocaleDateString()}
//               </span>
//             </li>
//           ))}
//           {pendingTutors.length === 0 && (
//             <div className="text-sm text-gray-500">No pending tutors</div>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// }

// // ----- Main page -----
// export default function AdminDashboardPage() {
//   const [preset, setPreset] = useState<PresetRange>('30d');
//   const [granularity, setGranularity] = useState<TimeGranularity>('daily');

//   const range = useMemo(() => computeRange(preset), [preset]);

//   const [kpis, setKpis] = useState<AdminKpis | null>(null);
//   const [rev, setRev] = useState<TrendPoint[]>([]);
//   const [enr, setEnr] = useState<TrendPoint[]>([]);
//   const [top, setTop] = useState<TopCourseRow[]>([]);
//   const [queues, setQueues] = useState<{
//     pendingCourses: PendingCourseListItem[];
//     pendingTutors: PendingTutorListItem[];
//   }>({
//     pendingCourses: [],
//     pendingTutors: [],
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let mounted = true;
//     setLoading(true);

//     Promise.all([
//       fetchKpis(range),
//       fetchRevenueTrend(range, granularity),
//       fetchEnrollmentTrend(range, 'monthly'),
//       fetchTopCourses(range, 5),
//       fetchApprovalQueues(6),
//     ])
//       .then(([k, r, e, t, q]) => {
//         if (!mounted) return;
//         setKpis(k);
//         setRev(r);
//         setEnr(e);
//         setTop(t);
//         setQueues(q);
//       })
//       .finally(() => mounted && setLoading(false));

//     return () => {
//       mounted = false;
//     };
//   }, [preset, granularity]);

//   return (
//     <div className="space-y-6">
//       {/* Filters */}
//       <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
//         <div className="text-2xl font-semibold text-gray-900">Admin Dashboard</div>
//         <div className="flex gap-2">
//           <select
//             className="rounded-lg border bg-white px-3 py-2 text-sm"
//             value={preset}
//             onChange={(e) => setPreset(e.target.value as PresetRange)}
//           >
//             <option value="7d">Last 7 days</option>
//             <option value="30d">Last 30 days</option>
//             <option value="90d">Last 90 days</option>
//           </select>

//           <select
//             className="rounded-lg border bg-white px-3 py-2 text-sm"
//             value={granularity}
//             onChange={(e) => setGranularity(e.target.value as TimeGranularity)}
//           >
//             <option value="daily">Daily revenue</option>
//             <option value="monthly">Monthly revenue</option>
//           </select>
//         </div>
//       </div>

//       {/* KPIs */}
//       <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
//         <KpiCard label="Total Students" value={kpis?.totalStudents ?? (loading ? '…' : 0)} />
//         <KpiCard label="Verified Students" value={kpis?.verifiedStudents ?? (loading ? '…' : 0)} />
//         <KpiCard label="Active Students" value={kpis?.activeStudents ?? (loading ? '…' : 0)} />
//         <KpiCard
//           label="Revenue"
//           value={`₹${(kpis?.revenue.mtd ?? 0).toLocaleString()}`}
//           sub={`Today: ₹${(kpis?.revenue.today ?? 0).toLocaleString()}`}
//         />
//       </div>

//       {/* Status blocks */}
//       <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
//         <div className="rounded-2xl border bg-white p-4 shadow-sm">
//           <div className="mb-2 text-sm font-medium text-gray-600">Courses by status</div>
//           <ul className="text-sm text-gray-800">
//             <li className="flex justify-between">
//               <span>Approved</span>
//               <span>{kpis?.courses.approved ?? 0}</span>
//             </li>
//             <li className="flex justify-between">
//               <span>Pending</span>
//               <span>{kpis?.courses.pending ?? 0}</span>
//             </li>
//             <li className="flex justify-between">
//               <span>Rejected</span>
//               <span>{kpis?.courses.rejected ?? 0}</span>
//             </li>
//           </ul>
//         </div>
//         <div className="rounded-2xl border bg-white p-4 shadow-sm">
//           <div className="mb-2 text-sm font-medium text-gray-600">Tutors by status</div>
//           <ul className="text-sm text-gray-800">
//             <li className="flex justify-between">
//               <span>Approved</span>
//               <span>{kpis?.tutors.approved ?? 0}</span>
//             </li>
//             <li className="flex justify-between">
//               <span>Verification submitted</span>
//               <span>{kpis?.tutors['verification-submitted'] ?? 0}</span>
//             </li>
//             <li className="flex justify-between">
//               <span>Pending</span>
//               <span>{kpis?.tutors.pending ?? 0}</span>
//             </li>
//             <li className="flex justify-between">
//               <span>Rejected</span>
//               <span>{kpis?.tutors.rejected ?? 0}</span>
//             </li>
//           </ul>
//         </div>
//         <div className="rounded-2xl border bg-white p-4 shadow-sm">
//           <div className="mb-2 text-sm font-medium text-gray-600">Failed payments (24h)</div>
//           <div className="text-3xl font-semibold text-gray-900">{kpis?.failedPayments24h ?? 0}</div>
//         </div>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
//         <TrendBlock title={`Revenue (${granularity})`} data={rev} kind="line" />
//         <TrendBlock title="Enrollments (monthly)" data={enr} kind="bar" />
//       </div>

//       {/* Top courses + queues */}
//       <TopCoursesTable rows={top} />
//       <ApprovalQueues pendingCourses={queues.pendingCourses} pendingTutors={queues.pendingTutors} />
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from 'react';
import {
  fetchKpis,
  fetchRevenueTrend,
  fetchEnrollmentTrend,
  fetchTopCourses,
  fetchApprovalQueues,
  type AdminKpis,
  type TrendPoint,
  type TopCourseRow,
  type PendingCourseListItem,
  type PendingTutorListItem,
  type TimeGranularity,
} from '../services/DashboardApi';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

// ----- small date helpers -----
type PresetRange = '7d' | '30d' | '90d';
const computeRange = (preset: PresetRange) => {
  const to = new Date();
  const days = preset === '7d' ? 7 : preset === '30d' ? 30 : 90;
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
  return { from, to };
};

// ----- KPI card -----
function KpiCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-2xl border bg-white p-4 sm:p-5 shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900">{value}</div>
      {sub && <div className="mt-1 text-xs text-gray-500">{sub}</div>}
    </div>
  );
}

// ----- Trend chart (generic) -----
function TrendBlock({
  title,
  data,
  kind = 'line',
}: {
  title: string;
  data: TrendPoint[];
  kind?: 'line' | 'bar';
}) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3 font-medium text-gray-800">{title}</div>
      <div className="h-56 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          {kind === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" dot={false} />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ----- Tables -----
function TopCoursesTable({ rows }: { rows: TopCourseRow[] }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3 font-medium text-gray-800">Top 5 Most-Sold Courses</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="p-3">Course</th>
              <th className="p-3">Tutor</th>
              <th className="p-3">Semester</th>
              <th className="p-3">Enrollments</th>
              <th className="p-3">Revenue</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.courseId} className="border-t">
                <td className="p-3">
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-gray-500">{r.code}</div>
                </td>
                <td className="p-3">{r.tutorName ?? '—'}</td>
                <td className="p-3">{r.semester}</td>
                <td className="p-3">{r.enrollments}</td>
                <td className="p-3">₹{r.revenue.toLocaleString()}</td>
                <td className="p-3">
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs capitalize text-gray-700">
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="p-3 text-gray-500" colSpan={6}>
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

function ApprovalQueues({
  pendingCourses,
  pendingTutors,
}: {
  pendingCourses: PendingCourseListItem[];
  pendingTutors: PendingTutorListItem[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-3 font-medium text-gray-800">Pending Course Approvals</div>
        <ul className="space-y-3">
          {pendingCourses.map((c) => (
            <li key={c.courseId} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{c.title}</div>
                <div className="text-xs text-gray-500">
                  {c.code} • Sem {c.semester} • {c.tutorName ?? 'Tutor'}
                </div>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(c.createdAt).toLocaleDateString()}
              </span>
            </li>
          ))}
          {pendingCourses.length === 0 && (
            <div className="text-sm text-gray-500">No pending courses</div>
          )}
        </ul>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-3 font-medium text-gray-800">Pending Tutor Verifications</div>
        <ul className="space-y-3">
          {pendingTutors.map((t) => (
            <li key={t.tutorId} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="text-xs text-gray-500">
                  {t.email} • {t.status}
                </div>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(t.createdAt).toLocaleDateString()}
              </span>
            </li>
          ))}
          {pendingTutors.length === 0 && (
            <div className="text-sm text-gray-500">No pending tutors</div>
          )}
        </ul>
      </div>
    </div>
  );
}

// ----- Main page -----
export default function AdminDashboardPage() {
  const [preset, setPreset] = useState<PresetRange>('30d');
  const [granularity, setGranularity] = useState<TimeGranularity>('daily');

  const range = useMemo(() => computeRange(preset), [preset]);

  const [kpis, setKpis] = useState<AdminKpis | null>(null);
  const [rev, setRev] = useState<TrendPoint[]>([]);
  const [enr, setEnr] = useState<TrendPoint[]>([]);
  const [top, setTop] = useState<TopCourseRow[]>([]);
  const [queues, setQueues] = useState<{
    pendingCourses: PendingCourseListItem[];
    pendingTutors: PendingTutorListItem[];
  }>({
    pendingCourses: [],
    pendingTutors: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.all([
      fetchKpis(range),
      fetchRevenueTrend(range, granularity),
      fetchEnrollmentTrend(range, 'monthly'),
      fetchTopCourses(range, 5),
      fetchApprovalQueues(6),
    ])
      .then(([k, r, e, t, q]) => {
        if (!mounted) return;
        setKpis(k);
        setRev(r);
        setEnr(e);
        setTop(t);
        setQueues(q);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [preset, granularity]);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Filters */}
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="text-2xl font-semibold text-gray-900">Admin Dashboard</div>
        <div className="flex w-full max-w-sm gap-2 sm:w-auto">
          <select
            className="w-1/2 rounded-lg border bg-white px-3 py-2 text-sm"
            value={preset}
            onChange={(e) => setPreset(e.target.value as PresetRange)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>

          <select
            className="w-1/2 rounded-lg border bg-white px-3 py-2 text-sm"
            value={granularity}
            onChange={(e) => setGranularity(e.target.value as TimeGranularity)}
          >
            <option value="daily">Daily revenue</option>
            <option value="monthly">Monthly revenue</option>
          </select>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Students" value={kpis?.totalStudents ?? (loading ? '…' : 0)} />
        <KpiCard label="Verified Students" value={kpis?.verifiedStudents ?? (loading ? '…' : 0)} />
        <KpiCard label="Active Students" value={kpis?.activeStudents ?? (loading ? '…' : 0)} />
        <KpiCard
          label="Revenue"
          value={`₹${(kpis?.revenue.mtd ?? 0).toLocaleString()}`}
          sub={`Today: ₹${(kpis?.revenue.today ?? 0).toLocaleString()}`}
        />
      </div>

      {/* Status blocks */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-2 text-sm font-medium text-gray-600">Courses by status</div>
          <ul className="text-sm text-gray-800">
            <li className="flex justify-between">
              <span>Approved</span>
              <span>{kpis?.courses.approved ?? 0}</span>
            </li>
            <li className="flex justify-between">
              <span>Pending</span>
              <span>{kpis?.courses.pending ?? 0}</span>
            </li>
            <li className="flex justify-between">
              <span>Rejected</span>
              <span>{kpis?.courses.rejected ?? 0}</span>
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-2 text-sm font-medium text-gray-600">Tutors by status</div>
          <ul className="text-sm text-gray-800">
            <li className="flex justify-between">
              <span>Approved</span>
              <span>{kpis?.tutors.approved ?? 0}</span>
            </li>
            <li className="flex justify-between">
              <span>Verification submitted</span>
              <span>{kpis?.tutors['verification-submitted'] ?? 0}</span>
            </li>
            <li className="flex justify-between">
              <span>Pending</span>
              <span>{kpis?.tutors.pending ?? 0}</span>
            </li>
            <li className="flex justify-between">
              <span>Rejected</span>
              <span>{kpis?.tutors.rejected ?? 0}</span>
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-2 text-sm font-medium text-gray-600">Failed payments (24h)</div>
          <div className="text-3xl font-semibold text-gray-900">{kpis?.failedPayments24h ?? 0}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <TrendBlock title={`Revenue (${granularity})`} data={rev} kind="line" />
        <TrendBlock title="Enrollments (monthly)" data={enr} kind="bar" />
      </div>

      {/* Top courses + queues */}
      <TopCoursesTable rows={top} />
      <ApprovalQueues pendingCourses={queues.pendingCourses} pendingTutors={queues.pendingTutors} />
    </div>
  );
}
