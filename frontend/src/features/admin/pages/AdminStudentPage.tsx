import { useCallback, useEffect, useState } from 'react';
import { fetchStudents, updateStudentBlockStatus } from '../services/AdminApi';
import type { IStudent } from '../../../types/types';
import { useDebouncedValue } from '../../../hooks/useDebounce';

const AdminStudentPage = () => {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [search, setSearch] = useState('');
  const debouncedSearch=useDebouncedValue(search,400)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchStudents(page, 5, debouncedSearch);
      setStudents(res.students);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to fetch students', err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  const handleBlockToggle = async (id: string, block: boolean) => {
    try {
      await updateStudentBlockStatus(id, block);
      setStudents((prev) =>
        prev.map((student) => (student._id === id ? { ...student, isBlocked: block } : student)),
      );
    } catch (err) {
      console.error('Failed to update block status', err);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold">Student Management</h2>

      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full rounded border px-4 py-2 md:w-1/2"
      />

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={3} className="py-4 text-center">
                Loading...
              </td>
            </tr>
          ) : students.length === 0 ? (
            <tr>
              <td colSpan={3} className="py-4 text-center">
                No students found.
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student._id} className="border-b">
                <td className="p-2">{student.name}</td>
                <td className="p-2">{student.email}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleBlockToggle(student._id, !student.isBlocked)}
                    className={`rounded px-4 py-1 text-white ${
                      student.isBlocked
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {student.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3">{page}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminStudentPage;
