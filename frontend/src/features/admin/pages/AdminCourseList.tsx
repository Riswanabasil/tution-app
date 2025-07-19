import  { useEffect, useState } from 'react';
import {fetchCourses,updateCourseStatus,} from '../services/CourseApi';
import type { IPaginatedCourses} from "../services/CourseApi"
import type { ICourse } from '../../../types/course';
import { AxiosError } from 'axios';
import { toast } from "react-toastify";

type Course = Pick<
  ICourse,
  '_id' | 'title' | 'code' | 'price' | 'details' | 'status'
>;

export type CourseStatus = 'pending' | 'approved' | 'rejected';
export default function CourseListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<CourseStatus | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
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
        searchTerm || undefined
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
  }, [page, statusFilter, searchTerm]);

  const onStatusChange = async (id: string, status: ICourse['status']) => {
    try {
      const updated = await updateCourseStatus(id, status);
      setCourses(cs =>
        cs.map(c => (c._id === id ? updated : c))
      );
      toast.success(`Status updated to ${status.toUpperCase()}!`)
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.message ?? 'Failed to update status');
      toast.error("Failed to update status");
    }
  };

 
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Admin: Course Management</h1>

      {/* filters */}
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Search by title or code…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded flex-1"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as CourseStatus | '')}
          className="px-3 py-2 border rounded"
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
        <table className="min-w-full bg-white shadow rounded overflow-hidden">
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
            {courses.map(c => (
              <tr key={c._id} className="border-b">
                <td className="px-4 py-2">{c.title}</td>
                <td className="px-4 py-2">{c.code}</td>
                <td className="px-4 py-2">{c.price}</td>
                <td className="px-4 py-2">{c.details}</td>
                <td className="px-4 py-2">
                  <select
                    value={c.status}
                    onChange={e =>
                      onStatusChange(c._id, e.target.value )
                    }
                    className="px-2 py-1 border rounded"
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
      )}

      {/* pagination */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page <= 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
