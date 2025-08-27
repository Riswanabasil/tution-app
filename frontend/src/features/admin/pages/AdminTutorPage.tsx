import { useCallback, useEffect, useState } from 'react';
import { fetchTutors, getTutorById, updateTutorStatus } from '../services/AdminApi';
import type { AxiosError } from 'axios';
import Modal from '../components/Modal';
import type { ITutor } from '../../../types/types';
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCoursesThunk } from "../../../redux/slices/courseSlice";
// import type { RootState, AppDispatch } from "../../../redux/store";

interface Tutor {
  _id: string;
  name: string;
  email: string;
  status: string;
  assignedCourses?: { _id: string; title: string }[];
}
// interface Course {
//   _id: string;
//   title: string;
// }

const AdminTutorPage = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selectedTutor, setSelectedTutor] = useState<ITutor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  // const [assigningTutorId, setAssigningTutorId] = useState<string | null>(null);
  // const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  // const [allCourses, setAllCourses] = useState<Course[]>([]);
  // const dispatch = useDispatch<AppDispatch>();
  // const { courses: allCourses } = useSelector(
  //   (state: RootState) => state.courses
  // );
  const loadTutors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchTutors(page, 5, status, search);
      console.log(res.tutors);

      setTutors(res.tutors);
      setTotalPages(res.totalPages);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Failed to load tutors');
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
      console.error('Failed to load tutor details', error);
      setError('Unable to load tutor details');
    }
  };
  const handleStatusUpdate = async (tutorId: string, status: 'approved' | 'rejected') => {
    try {
      await updateTutorStatus(tutorId, status);
      setTutors((prev) =>
        prev.map((tutor) => (tutor._id === tutorId ? { ...tutor, status: status } : tutor)),
      );
    } catch (error) {
      console.error('Failed to update tutor status', error);
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTutor(null);
  };

  // const handleOpenAssignModal = async (tutorId: string) => {
  //   try {
  //     const tutor = await getTutorById(tutorId);
  //     setAssigningTutorId(tutorId);
  //     setSelectedCourseIds(
  //       Array.isArray(tutor.assignedCourses)
  //         ? tutor.assignedCourses.map((course) => course._id)
  //         : []
  //     );
  //     dispatch(fetchCoursesThunk());
  //     setIsAssignModalOpen(true);
  //   } catch (error) {
  //     console.error("Failed to load tutor or courses", error);
  //   }
  // };

  // const handleAssignCourses = async () => {
  //   if (!assigningTutorId) return;

  //   try {
  //     await assignCoursesToTutor(assigningTutorId, selectedCourseIds);
  //     setIsAssignModalOpen(false);
  //     loadTutors();
  //   } catch (error) {
  //     console.error("Failed to assign courses", error);
  //   }
  // };

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold">Tutor Management</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded border px-4 py-2 md:w-1/2"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded border px-4 py-2 md:w-1/4"
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
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Assigned Course</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tutors.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-4 text-center">
                No tutors found.
              </td>
            </tr>
          ) : (
            tutors.map((tutor) => (
              <tr key={tutor._id} className="border-t text-center">
                <td className="p-2">{tutor.name}</td>
                <td className="p-2">{tutor.email}</td>
                <td className="p-2 capitalize">{tutor.status}</td>
                {/* <td className="p-2">{tutor.assignedCourses|| "------"}</td> */}
                <td>
                  {Array.isArray(tutor.assignedCourses) && tutor.assignedCourses.length > 0
                    ? tutor.assignedCourses.map((course) => course.title).join(', ')
                    : 'No Courses Assigned'}
                </td>

                <td className="space-x-2 p-2">
                  <button
                    onClick={() => handleViewTutor(tutor)}
                    // className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                  {tutor.status !== 'approved' && (
                    <button
                      onClick={() => handleStatusUpdate(tutor._id, 'approved')}
                      // className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      className="text-green-600 hover:underline"
                    >
                      Approve
                    </button>
                  )}
                  {tutor.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusUpdate(tutor._id, 'rejected')}
                      // className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      className="text-red-600 hover:underline"
                    >
                      Reject
                    </button>
                  )}

                  {/* {tutor.status === "approved" && (
                    <button
                      onClick={() => handleOpenAssignModal(tutor._id)}
                      className="text-green-600 hover:underline"
                    >
                      Assign Courses
                    </button>
                  )} */}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">{page}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="rounded border px-3 py-1 disabled:opacity-50"
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
                  <strong>Education:</strong> {selectedTutor.verificationDetails.education}
                </p>
                <p>
                  <strong>Experience:</strong> {selectedTutor.verificationDetails.experience}
                </p>
                <p>
                  <strong>Summary:</strong> {selectedTutor.verificationDetails.summary}
                </p>

                <p>
                  <strong>ID Proof:</strong>{' '}
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
                  <strong>Resume:</strong>{' '}
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

      {/* <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Courses"
      >
        <div className="space-y-2">
          <p>Select courses to assign:</p>
          {allCourses.map((course) => (
            <label key={course._id} className="block">
              <input
                type="checkbox"
                checked={selectedCourseIds.includes(course._id)}
                onChange={() => {
                  setSelectedCourseIds((prev) =>
                    prev.includes(course._id)
                      ? prev.filter((id) => id !== course._id)
                      : [...prev, course._id]
                  );
                }}
              />
              <span className="ml-2">{course.title}</span>
            </label>
          ))}

          <button
            onClick={handleAssignCourses}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </Modal> */}
    </div>
  );
};

export default AdminTutorPage;
