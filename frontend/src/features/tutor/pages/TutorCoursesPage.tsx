import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  getCourses,
  deleteCourse
} from '../services/TutorApi';
import type { ICourse } from '../../../types/course';
import { toast } from 'react-toastify';

import Swal from 'sweetalert2';


export default function CourseListPage() {
  const [courses, setCourses]       = useState<ICourse[]>([]);
  const [page, setPage]             = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const { courses, currentPage, totalPages } =
        await getCourses(page, limit, search);
      setCourses(courses);
      setTotalPages(totalPages);
      setPage(currentPage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, search]);

const onDelete = async (id: string) => {
  const result = await Swal.fire({
    title: 'Delete this course?',
    text:  "This action can't be undone.",
    icon:  'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor:  '#6b7280',
    confirmButtonText: 'Yes, delete it'
  });

  if (result.isConfirmed) {
    await deleteCourse(id);
    toast.success('Course deleted');
    load();
  }
}

  return (
    <div className="p-6 space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Courses</h1>
        <button
          onClick={() => navigate('/tutor/courses/add')}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Add Course
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by title or code…"
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-full max-w-sm border px-3 py-2 rounded shadow-sm focus:ring focus:border-blue-300"
      />

      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          <table className="min-w-full bg-white shadow overflow-hidden rounded">
            <thead className="bg-gray-100">
              <tr>
                {['Title', 'Code', 'Semester', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr
                  key={c._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{c.title}</td>
                  <td className="px-4 py-2">{c.code}</td>
                  <td className="px-4 py-2">{c.semester}</td>
                  <td className="px-4 py-2 capitalize">{c.status}</td>
                  <td className="px-4 py-2 space-x-2">
                    {/* Edit */}
                    <button
                      onClick={() => navigate(`/tutor/courses/${c._id}/edit`)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => onDelete(c._id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>

                    {/* Manage Content / Awaiting */}
                    {c.status === 'approved' ? (
                      <Link
                        to={`/tutor/courses/${c._id}/content`}
                        className="text-green-600 hover:underline text-sm"
                      >
                        Manage Content
                      </Link>
                    ) : (
                      <span className="text-gray-500 text-sm">
                        Awaiting approval
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-4 pt-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm">
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
        </>
      )}
    </div>
  );
}
