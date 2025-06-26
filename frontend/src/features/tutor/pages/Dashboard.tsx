import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAssignedCourses } from "../../../redux/slices/assignedCoursesSlice";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState,AppDispatch } from "../../../redux/store";
// import { ICourse } from "../../../types/course";

const Dashboard = () => {
  const { courses, loading, error } = useSelector((state: RootState) => state.assignedCourses);
  const dispatch = useDispatch<AppDispatch>();
  console.log(courses);
  

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  useEffect(() => {
  dispatch(fetchAssignedCourses());
}, [dispatch]);
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const displayedCourses = filteredCourses.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    // <div className="p-6">
    //   <div className="flex justify-between items-center mb-4">
    //     <h2 className="text-2xl font-semibold">My Courses</h2>
    //   </div>

    //   <input
    //     type="text"
    //     placeholder="Search courses..."
    //     value={search}
    //     onChange={(e) => setSearch(e.target.value)}
    //     className="px-4 py-2 border rounded mb-4 w-full md:w-1/3"
    //   />

    //   {loading ? (
    //     <p>Loading...</p>
    //   ) : error ? (
    //     <p className="text-red-600">{error}</p>
    //   ) : (
    //     <div className="grid gap-4">
    //       {displayedCourses.map((course) => (
    //         <div key={course._id} className="border p-4 rounded shadow-sm">
    //           <h3 className="text-lg font-semibold">{course.title}</h3>
    //           <p className="text-sm text-gray-600">Code: {course.code}</p>
    //           <p className="text-sm text-gray-600">Semester: {course.semester}</p>
    //           <p className="text-sm text-gray-600">Price: ₹{course.price}</p>
    //           <button className="mt-2 text-blue-600 hover:underline">View Modules</button>
    //         </div>
    //       ))}
    //     </div>
    //   )}

    //   {/* Pagination Controls */}
    //   <div className="flex justify-center mt-6 gap-2">
    //     <button
    //       disabled={page === 1}
    //       onClick={() => setPage((p) => p - 1)}
    //       className="px-3 py-1 border rounded disabled:opacity-50"
    //     >
    //       Prev
    //     </button>
    //     <span className="px-3 py-1">{page}</span>
    //     <button
    //       disabled={page === totalPages}
    //       onClick={() => setPage((p) => p + 1)}
    //       className="px-3 py-1 border rounded disabled:opacity-50"
    //     >
    //       Next
    //     </button>
    //   </div>
    // </div>

    <div className="p-6 bg-gray-50 min-h-screen">
  {/* Header */}
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-3xl font-bold text-indigo-700">My Courses</h2>
  </div>

  {/* Search */}
  <input
    type="text"
    placeholder="Search courses..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="px-4 py-2 border border-gray-300 rounded-md mb-6 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
  />

  {/* Course List */}
  {loading ? (
    <p className="text-gray-500">Loading...</p>
  ) : error ? (
    <p className="text-red-600 font-medium">{error}</p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayedCourses.map((course) => (
        <div
          key={course._id}
          className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition"
        >
          <h3 className="text-xl font-semibold text-indigo-700 mb-2">{course.title}</h3>
          <p className="text-sm text-gray-600 mb-1">📘 Code: <span className="font-medium">{course.code}</span></p>
          <p className="text-sm text-gray-600 mb-1">🎓 Semester: {course.semester}</p>
          <p className="text-sm text-gray-600 mb-3">💰 Price: ₹{course.price}</p>

          <div className="flex gap-4 mt-4">
    
    
    <button
      className="text-green-600 font-medium hover:text-green-800 transition"
      onClick={() => {/* handle add module */}}
    >
      + Add Module
    </button>

    <button
      className="text-indigo-600 font-medium hover:text-indigo-800 transition"
      onClick={() => {/* handle view modules */}}
    >
      View Modules →
    </button>
  </div>
        </div>
      ))}
    </div>
  )}

  {/* Pagination */}
  <div className="flex justify-center mt-10 items-center gap-3">
    <button
      disabled={page === 1}
      onClick={() => setPage((p) => p - 1)}
      className="px-4 py-2 rounded-md border border-gray-300 text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
    >
      Prev
    </button>
    <span className="px-4 py-2 text-sm font-medium bg-indigo-100 text-indigo-700 rounded">
      {page}
    </span>
    <button
      disabled={page === totalPages}
      onClick={() => setPage((p) => p + 1)}
      className="px-4 py-2 rounded-md border border-gray-300 text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
    >
      Next
    </button>
  </div>
</div>

  );
};

export default Dashboard;
