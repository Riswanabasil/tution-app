
import  { useEffect, useState } from "react";
import { getApprovedCourses, getMyCourses } from "../services/CourseApi";
import type { ICourse } from "../../../types/course";
import CourseCard from "../components/CourseCard";
import { useNavigate } from "react-router-dom";

export default function CourseGridPage() {
  const [courses, setCourses]       = useState<ICourse[]>([]);
   const [purchasedIds, setPurchasedIds] = useState<Set<string>>(new Set());
  const [page, setPage]             = useState(1);
  const [limit] = useState(3);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      // parallel fetch
      const [
        { courses, currentPage, totalPages: tp },
        myCourses,
      ] = await Promise.all([
        getApprovedCourses(page, limit, search),
        getMyCourses(),
      ]);

      setCourses(courses);
       setPage(currentPage)
      setTotalPages(tp);
      setPurchasedIds(new Set(myCourses.map((m) => m.course._id)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    
  }, [page, search]);

  const handleExplore = (id: string) => {
    navigate(`/student/courses/${id}`);
  };

   const handleGoToCourse = (id: string) => {
    navigate(`/student/purchased-course/${id}`);
  };
  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">All Courses</h1>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="w-full max-w-md border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring"
        />
      </div>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-600">No courses available yet.</p>
      ) : (
        <>
  

           <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => {
              const bought = purchasedIds.has(c._id);
              return (
                <CourseCard
                  key={c._id}
                  course={c}
                  isPurchased={bought}
                  onExplore={handleExplore}
                  onGoToCourse={handleGoToCourse}
                />
              );
            })}
          </div>

          {/* Pagination controls */}
          <div className="flex items-center justify-center space-x-4 pt-6">
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
