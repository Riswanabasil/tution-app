// import { useEffect, useState } from 'react';
// import { fetchCourses, updateCourseStatus } from '../services/CourseApi';
// import type { IPaginatedCourses } from '../services/CourseApi';
// import type { ICourse } from '../../../types/course';
// import { AxiosError } from 'axios';
// import { toast } from 'react-toastify';
// import { useDebouncedValue } from '../../../hooks/useDebounce';

// type Course = Pick<ICourse, '_id' | 'title' | 'code' | 'price' | 'details' | 'status'>;

// export type CourseStatus = 'pending' | 'approved' | 'rejected';
// export default function CourseListPage() {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [statusFilter, setStatusFilter] = useState<CourseStatus | ''>('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const debouncedSearch=useDebouncedValue(searchTerm,400)
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const loadPage = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result: IPaginatedCourses = await fetchCourses(
//         page,
//         limit,
//         statusFilter || undefined,
//         debouncedSearch || undefined,
//       );
//       setCourses(result.courses);
//       setTotalPages(result.totalPages);
//     } catch (err: unknown) {
//       const axiosError = err as AxiosError<{ message: string }>;
//       setError(axiosError.message ?? 'Failed to load courses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadPage();
//   }, [page, statusFilter, debouncedSearch]);

//   const onStatusChange = async (id: string, status: ICourse['status']) => {
//     try {
//       const updated = await updateCourseStatus(id, status);
//       setCourses((cs) => cs.map((c) => (c._id === id ? updated : c)));
//       toast.success(`Status updated to ${status.toUpperCase()}!`);
//     } catch (err: unknown) {
//       const axiosError = err as AxiosError<{ message: string }>;
//       setError(axiosError.message ?? 'Failed to update status');
//       toast.error('Failed to update status');
//     }
//   };

//   return (
//     <div className="space-y-4 p-6">
//       <h1 className="text-2xl font-semibold">Admin: Course Management</h1>

//       {/* filters */}
//       <div className="flex space-x-4">
//         <input
//           type="text"
//           placeholder="Search by title or code…"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="flex-1 rounded border px-3 py-2"
//         />
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value as CourseStatus | '')}
//           className="rounded border px-3 py-2"
//         >
//           <option value="">All Statuses</option>
//           <option value="pending">Pending</option>
//           <option value="approved">Approved</option>
//           <option value="rejected">Rejected</option>
//         </select>
//       </div>

//       {/* loading / error */}
//       {loading && <p>Loading courses…</p>}
//       {error && <p className="text-red-600">Error: {error}</p>}

//       {/* courses table */}
//       {!loading && !error && (
//         <table className="min-w-full overflow-hidden rounded bg-white shadow">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th className="px-4 py-2">Title</th>
//               <th className="px-4 py-2">Code</th>
//               <th className="px-4 py-2">Price</th>
//               <th className="px-4 py-2">Details</th>
//               <th className="px-4 py-2">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {courses.map((c) => (
//               <tr key={c._id} className="border-b">
//                 <td className="px-4 py-2">{c.title}</td>
//                 <td className="px-4 py-2">{c.code}</td>
//                 <td className="px-4 py-2">{c.price}</td>
//                 <td className="px-4 py-2">{c.details}</td>
//                 <td className="px-4 py-2">
//                   <select
//                     value={c.status}
//                     onChange={(e) => onStatusChange(c._id, e.target.value)}
//                     className="rounded border px-2 py-1"
//                   >
//                     <option value="pending">Pending</option>
//                     <option value="approved">Approved</option>
//                     <option value="rejected">Rejected</option>
//                   </select>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* pagination */}
//       <div className="flex items-center justify-between">
//         <button
//           onClick={() => setPage((p) => Math.max(1, p - 1))}
//           disabled={page <= 1}
//           className="rounded border px-3 py-1 disabled:opacity-50"
//         >
//           Prev
//         </button>
//         <span>
//           Page {page} of {totalPages}
//         </span>
//         <button
//           onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//           disabled={page >= totalPages}
//           className="rounded border px-3 py-1 disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { fetchCourses, updateCourseStatus } from '../services/CourseApi';
import type { IPaginatedCourses } from '../services/CourseApi';
import type { ICourse } from '../../../types/course';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useDebouncedValue } from '../../../hooks/useDebounce';

type Course = Pick<ICourse, '_id' | 'title' | 'code' | 'price' | 'details' | 'status'>;

export type CourseStatus = 'pending' | 'approved' | 'rejected';
export default function CourseListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<CourseStatus | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebouncedValue(searchTerm, 400);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPage = async () => {
    setLoading(true);
    setError(null);
    try {
      const result: IPaginatedCourses = await fetchCourses(
        page,
        limit,
        statusFilter || undefined,
        debouncedSearch || undefined
      );
      setCourses(result.courses);
      setTotalPages(result.totalPages);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.message ?? 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, [page, statusFilter, debouncedSearch]);

  const onStatusChange = async (id: string, status: ICourse['status']) => {
    try {
      const updated = await updateCourseStatus(id, status);
      setCourses((cs) => cs.map((c) => (c._id === id ? updated : c)));
      toast.success(`Status updated to ${status.toUpperCase()}!`);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.message ?? 'Failed to update status');
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <h1 className="text-2xl font-semibold">Admin: Course Management</h1>

      {/* filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:space-x-4">
        <input
          type="text"
          placeholder="Search by title or code…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as CourseStatus | '')}
          className="w-full sm:w-48 rounded border px-3 py-2"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* loading / error */}
      {loading && <p>Loading courses…</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {/* courses table */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto overflow-hidden rounded bg-white shadow">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Code</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Details</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c._id} className="border-b">
                  <td className="px-4 py-2 align-top break-words max-w-xs">{c.title}</td>
                  <td className="px-4 py-2 align-top">{c.code}</td>
                  <td className="px-4 py-2 align-top">{c.price}</td>
                  <td className="px-4 py-2 align-top break-words max-w-sm">{c.details}</td>
                  <td className="px-4 py-2 align-top">
                    <select
                      value={c.status}
                      onChange={(e) => onStatusChange(c._id, e.target.value)}
                      className="rounded border px-2 py-1 w-full sm:w-auto"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* pagination */}
      <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
      </div>
    </div>
  );
}

