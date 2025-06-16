import { useCallback, useEffect, useState } from "react";
import { fetchTutors, getTutorById, updateTutorStatus } from "../services/AdminApi";
import type { AxiosError } from "axios";
import Modal from "../components/Modal";
import type { ITutor } from "../../../types/types";

interface Tutor {
  _id: string;
  name: string;
  email: string;
  status: string;
  assignedCourse?: string | null;
}

const AdminTutorPage = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selectedTutor, setSelectedTutor] = useState<ITutor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const loadTutors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchTutors(page, 5, status, search);
      setTutors(res.tutors);
      setTotalPages(res.totalPages);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || "Failed to load tutors");
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    loadTutors();
  }, [loadTutors]);
 const handleViewTutor = async (tutor: Tutor) => {
  
  try {
    const fullTutor = await getTutorById(tutor._id);
    setSelectedTutor(fullTutor);
    setIsModalOpen(true);
  } catch (error) {
    console.error("Failed to load tutor details", error);
    setError("Unable to load tutor details");
  }
};
const handleStatusUpdate = async (tutorId: string, status: "approved" | "rejected") => {
  try {
    
    await updateTutorStatus(tutorId, status);
    loadTutors(); // refresh the table
  } catch (error) {
    console.error("Failed to update tutor status", error);
  }
};
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTutor(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Tutor Management</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded w-full md:w-1/2"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 border rounded w-full md:w-1/4"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Assigned Course</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tutors.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-4">
                No tutors found.
              </td>
            </tr>
          ) : (
            tutors.map((tutor) => (
              <tr key={tutor._id} className="text-center border-t">
                <td className="p-2">{tutor.name}</td>
                <td className="p-2">{tutor.email}</td>
                <td className="p-2 capitalize">{tutor.status}</td>
                <td className="p-2">{tutor.assignedCourse || "------"}</td>
                <td className="p-2 space-x-2">
  <button
    onClick={() => handleViewTutor(tutor)}
    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
  >
    View
  </button>
  {tutor.status !== "approved" && (
    <button
      onClick={() => handleStatusUpdate(tutor._id, "approved")}
      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Approve
    </button>
  )}
  {tutor.status !== "rejected" && (
    <button
      onClick={() => handleStatusUpdate(tutor._id, "rejected")}
      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Reject
    </button>
  )}
</td>

              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">{page}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Tutor Details">
        {selectedTutor && (
          <div className="space-y-2 text-sm">
            <p>
              <strong>Name:</strong> {selectedTutor.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedTutor.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedTutor.phone}
            </p>
            <p>
              <strong>Status:</strong> {selectedTutor.status}
            </p>

            {selectedTutor.verificationDetails && (
              <>
                <p>
                  <strong>Education:</strong>{" "}
                  {selectedTutor.verificationDetails.education}
                </p>
                <p>
                  <strong>Experience:</strong>{" "}
                  {selectedTutor.verificationDetails.experience}
                </p>
                <p>
                  <strong>Summary:</strong>{" "}
                  {selectedTutor.verificationDetails.summary}
                </p>

                <p>
                  <strong>ID Proof:</strong>{" "}
                  <a
                    href={`http://localhost:5000/uploads/tutorDocs/${selectedTutor.verificationDetails.idProof}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View ID
                  </a>
                </p>

                <p>
                  <strong>Resume:</strong>{" "}
                  <a
                    href={`http://localhost:5000/uploads/tutorDocs/${selectedTutor.verificationDetails.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Resume
                  </a>
                </p>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminTutorPage;
