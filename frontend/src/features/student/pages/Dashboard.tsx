import { useEffect, useState } from "react";
import { getApprovedCourses, getMyCourses } from "../services/CourseApi";
import type { ICourse } from "../../../types/course";
import CourseCard from "../components/CourseCard";
import { useNavigate } from "react-router-dom";
import { Search, Filter, BookOpen, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

export default function CourseGridPage() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [purchasedIds, setPurchasedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [limit] = useState(3);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const [
        { courses, currentPage, totalPages: tp },
        myCourses,
      ] = await Promise.all([
        getApprovedCourses(page, limit, search, semester, sortBy),
        getMyCourses(),
      ]);

      setCourses(courses);
      setPage(currentPage);
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
  }, [page, search, semester, sortBy]);

  const handleExplore = (id: string) => {
    navigate(`/student/courses/${id}`);
  };

  const handleGoToCourse = (id: string) => {
    navigate(`/student/purchased-course/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Explore Courses
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing courses and enhance your skills with our comprehensive learning platform
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for courses, topics, or skills..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Semester Filters */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <span className="font-semibold text-gray-700">Filter by Semester:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSemester(i + 1);
                      setPage(1);
                    }}
                    className={`px-4 py-2 rounded-full font-medium transition-all transform hover:scale-105 ${
                      semester === i + 1
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Sem {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setSemester(undefined);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-full font-medium transition-all transform hover:scale-105 ${
                    semester === undefined 
                      ? "bg-gray-600 text-white shadow-lg" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="space-y-3">
              <span className="font-semibold text-gray-700">Sort by:</span>
              <select
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                value={sortBy || ""}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-white shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              >
                <option value="">Default Order</option>
                <option value="actualPrice">Price: Low to High</option>
                <option value="-actualPrice">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-xl text-gray-600 font-medium">Loading amazing courses...</p>
            </div>
          </div>
        )}

        {/* No Courses State */}
        {!loading && courses.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Courses Grid */}
        {!loading && courses.length > 0 && (
          <div className="space-y-8">
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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

            {/* Pagination */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    page <= 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  }`}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold">
                    Page {page} of {totalPages}
                  </div>
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    page >= totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  }`}
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}