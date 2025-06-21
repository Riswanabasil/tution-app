import { useCallback, useEffect, useState } from "react";
import {
  fetchStudents,
  updateStudentBlockStatus,
} from "../services/AdminApi";
import type { IStudent } from "../../../types/types";

const AdminStudentPage = () => {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchStudents(page, 5, search);
      setStudents(res.students);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoading(false);
    }
  },[page, search]);

  const handleBlockToggle = async (id: string, block: boolean) => {
    try {
      await updateStudentBlockStatus(id, block);
      setStudents((prev) =>
      prev.map((student) =>
        student._id === id ? { ...student, isBlocked: block } : student
      )
    );
    } catch (err) {
      console.error("Failed to update block status", err);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Student Management</h2>

      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-4 py-2 border rounded w-full md:w-1/2 mb-4"
      />

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={3} className="text-center py-4">
                Loading...
              </td>
            </tr>
          ) : students.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-4">
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
                    className={`px-4 py-1 rounded text-white ${
                      student.isBlocked ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {student.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3">{page}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminStudentPage;
