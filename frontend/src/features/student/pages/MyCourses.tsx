// src/features/student/pages/MyCoursesPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyCourses } from "../services/CourseApi";
import type { MyCourseDTO} from '../services/CourseApi'

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<MyCourseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyCourses()
      .then(setCourses)
      .catch((err) => setError(err.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6 text-center">Loading…</p>;
  if (error)   return <p className="p-6 text-center text-red-600">{error}</p>;
  if (!courses.length)
    return <p className="p-6 text-center">You have no enrolled courses.</p>;

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(({ enrollmentId, course }) => (
        <div
          key={enrollmentId}
          className="bg-white rounded-lg overflow-hidden shadow-lg flex flex-col"
        >
          {/* Thumbnail */}
          <div className="h-48 w-full overflow-hidden">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
            <p className="text-gray-600 flex-grow">{course.details}</p>
            <Link
              to={`/student/purchased-course/${course._id}`}
              className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded transition"
            >
              Go to Course
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
