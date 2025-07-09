// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { AppDispatch, RootState } from "../../../redux/store";
// import {
//   fetchCoursesThunk,
//   deleteCourseThunk,
// } from "../../../redux/slices/courseSlice";
// import { useNavigate } from "react-router-dom";
// import Modal from "../../admin/components/Modal";


// const TutorCoursesPage = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
    
//   const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const { courses, loading, error } = useSelector(
//     (state: RootState) => state.courses
//   );

//   useEffect(() => {
    
//     dispatch(fetchCoursesThunk());
    
//   }, [dispatch]);

//   const deleteCourse = (id: string) => {
//     setSelectedCourseId(id);
//     setIsModalOpen(true);
//   };

//   const confirmDelete = () => {
//     if (selectedCourseId) {
//       dispatch(deleteCourseThunk(selectedCourseId));
//       setIsModalOpen(false);
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Course Management</h2>
//         <button
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//           onClick={() => navigate("/tutor/course/new")}
//         >
//           + Add Course
//         </button>
//       </div>

//       {loading ? (
//         <p className="text-gray-500">Loading...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : (
//         <table className="w-full table-auto border-collapse border">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th className="border px-4 py-2">Title</th>
//               <th className="border px-4 py-2">Code</th>
//               <th className="border px-4 py-2">Semester</th>
//               <th className="border px-4 py-2">Price</th>
//               <th className="border px-4 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {courses.map((course) => (
//               <tr key={course._id} className="hover:bg-gray-50">
//                 <td className="border px-4 py-2">{course.title}</td>
//                 <td className="border px-4 py-2">{course.code}</td>
//                 <td className="border px-4 py-2">{course.semester}</td>
//                 <td className="border px-4 py-2">₹{course.price}</td>
//                 <td className="border px-4 py-2">
//                   <button
//                     onClick={() => navigate(`/tutor/course/edit/${course._id}`)}
//                     className="text-blue-600 hover:underline mr-4"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => {
//                       deleteCourse(course._id);
//                     }}
//                     className="text-red-600 hover:underline"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         title="Confirm Delete"
//       >
//         <p className="mb-4">Are you sure you want to delete this course?</p>
//         <div className="flex justify-end gap-4">
//           <button
//             className="px-4 py-2 bg-red-600 text-white rounded"
//             onClick={confirmDelete}
//           >
//             Yes, Delete
//           </button>
//           <button
//             className="px-4 py-2 bg-gray-300 rounded"
//             onClick={() => setIsModalOpen(false)}
//           >
//             Cancel
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default TutorCoursesPage;
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

  // const onDelete = async (id: string) => {
  //   if (!window.confirm('Delete this course?')) return;
  //   await deleteCourse(id);
  //   load();
  // };

//   const onDelete = async (id: string) => {
//   if (!window.confirm('Are you sure you want to delete this course?')) {
//     return;
//   }
//   try {
//     await deleteCourse(id);
//     toast.success('Course deleted');    // uses your root-level ToastContainer
//     load();                             // re-fetch the list
//   } catch (err: unknown) {
//     const axiosError = err as AxiosError<{ message: string }>;
//     toast.error('Failed to delete: ' + (axiosError.response?.data?.message || axiosError.message));
//   }
// }

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
