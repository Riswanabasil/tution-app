import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCourses, deleteCourse, reapplyCourse } from '../services/TutorApi';
import type { ICourse } from '../../../types/course';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import type { AxiosError } from 'axios';

export default function CourseListPage() {
  const [allCourses, setAllCourses] = useState<ICourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<ICourse[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const paginate = (data: ICourse[], page: number, limit: number) => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return data.slice(start, end);
  };

  const filterAndPaginate = () => {
    let filtered = allCourses;

    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (c) => c.title.toLowerCase().includes(query) || c.code.toLowerCase().includes(query),
      );
    }

    if (filterSemester) {
      filtered = filtered.filter((c) => c.semester.toString() === filterSemester);
    }

    if (filterStatus) {
      filtered = filtered.filter((c) => c.status === filterStatus);
    }

    setTotalPages(Math.max(1, Math.ceil(filtered.length / limit)));
    const paginated = paginate(filtered, page, limit);
    setFilteredCourses(paginated);
  };

  const load = async () => {
    setLoading(true);
    try {
      const { courses } = await getCourses();
      setAllCourses(courses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    filterAndPaginate();
  }, [search, filterSemester, filterStatus, page, allCourses]);

  const onDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Delete this course?',
      text: "This action can't be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it',
    });

    if (result.isConfirmed) {
      await deleteCourse(id);
      toast.success('Course deleted');
      load();
    }
  };

  const handleReapply = async (courseId: string) => {
    try {
      const updated = await reapplyCourse(courseId);
      setAllCourses((cs) => cs.map((c) => (c._id === courseId ? updated : c)));
      toast.success('Re-applied successfully!');
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message || 'Failed to re-apply.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <svg
                className="h-7 w-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-3xl font-bold text-transparent">
                My Courses
              </h1>
              <p className="mt-1 text-slate-500">Manage and organize your teaching courses</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/tutor/courses/add')}
            className="group flex transform items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl"
          >
            <svg
              className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add New Course
          </button>
        </div>

        {/* Filters Section */}
        <div className="rounded-2xl border border-white/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search courses by title or code..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white/50 py-3 pl-10 pr-4 shadow-sm backdrop-blur-sm transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Semester Filter */}
            <div className="relative">
              <select
                value={filterSemester}
                onChange={(e) => {
                  setFilterSemester(e.target.value);
                  setPage(1);
                }}
                className="min-w-[160px] appearance-none rounded-xl border border-slate-200 bg-white/50 py-3 pl-4 pr-10 font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Semesters</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
                <option value="7">Semester 7</option>
                <option value="8">Semester 8</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-4 w-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setPage(1);
                }}
                className="min-w-[140px] appearance-none rounded-xl border border-slate-200 bg-white/50 py-3 pl-4 pr-10 font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-4 w-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="overflow-hidden rounded-2xl border border-white/50 bg-white/90 shadow-xl backdrop-blur-sm">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
              <p className="font-medium text-slate-600">Loading your courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <svg
                  className="h-8 w-8 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-800">No courses found</h3>
              <p className="text-center text-slate-500">
                Try adjusting your search criteria or create a new course to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-slate-700">
                      Course
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-slate-700">
                      Code
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-slate-700">
                      Semester
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-slate-700">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCourses.map((c) => (
                    <tr
                      key={c._id}
                      className="group transition-all duration-200 hover:bg-slate-50/50"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center">
                          <div
                            className={`mr-3 flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold text-white ${
                              c.status === 'approved'
                                ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                                : c.status === 'pending'
                                  ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                                  : 'bg-gradient-to-br from-red-500 to-pink-500'
                            }`}
                          >
                            {c.title.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 group-hover:text-slate-900">
                              {c.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                          {c.code}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-medium text-slate-600">{c.semester}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold capitalize ${
                            c.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-700'
                              : c.status === 'pending'
                                ? 'bg-amber-100 text-amber-700'
                                : c.status === 'rejected'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {c.status === 'approved' && (
                            <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          {c.status === 'pending' && (
                            <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          {c.status === 'rejected' && (
                            <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => navigate(`/tutor/courses/${c._id}/edit`)}
                            className="rounded-md px-2 py-1 font-medium text-indigo-600 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-700"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => onDelete(c._id)}
                            className="rounded-md px-2 py-1 font-medium text-red-600 transition-all duration-200 hover:bg-red-50 hover:text-red-700"
                          >
                            Delete
                          </button>

                          {c.status === 'approved' ? (
                            <Link
                              to={`/tutor/courses/${c._id}/content`}
                              className="rounded-md px-2 py-1 font-medium text-emerald-600 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700"
                            >
                              Manage Content
                            </Link>
                          ) : c.status === 'rejected' ? (
                            <button
                              onClick={() => handleReapply(c._id)}
                              className="rounded-md px-2 py-1 font-medium text-orange-600 transition-all duration-200 hover:bg-orange-50 hover:text-orange-700"
                            >
                              Re-apply
                            </button>
                          ) : (
                            <span className="px-2 py-1 font-medium text-slate-500">
                              Awaiting approval
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Enhanced Pagination */}
          {filteredCourses.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-200 bg-gradient-to-r from-slate-50/50 to-white/50 px-6 py-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-sm transition-all duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Previous
                </button>

                <div className="mx-4 flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`h-10 w-10 rounded-lg font-medium transition-all duration-200 ${
                          page === pageNum
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-sm transition-all duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
