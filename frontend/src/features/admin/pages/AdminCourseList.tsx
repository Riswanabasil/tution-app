import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import {
  fetchCoursesThunk,
  deleteCourseThunk,
} from "../../../redux/slices/courseSlice";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

const AdminCourseList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { courses, loading, error } = useSelector(
    (state: RootState) => state.courses
  );

  useEffect(() => {
    dispatch(fetchCoursesThunk());
  }, [dispatch]);

  const deleteCourse = (id: string) => {
    setSelectedCourseId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCourseId) {
      dispatch(deleteCourseThunk(selectedCourseId));
      setIsModalOpen(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Course Management</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/admin/course/new")}
        >
          + Add Course
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full table-auto border-collapse border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Code</th>
              <th className="border px-4 py-2">Semester</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{course.title}</td>
                <td className="border px-4 py-2">{course.code}</td>
                <td className="border px-4 py-2">{course.semester}</td>
                <td className="border px-4 py-2">₹{course.price}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => navigate(`/admin/course/edit/${course._id}`)}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      deleteCourse(course._id);
                    }}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Delete"
      >
        <p className="mb-4">Are you sure you want to delete this course?</p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={confirmDelete}
          >
            Yes, Delete
          </button>
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminCourseList;
