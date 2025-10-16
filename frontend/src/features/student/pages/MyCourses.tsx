
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyCourses } from '../services/CourseApi';
import type { MyCourseDTO } from '../services/CourseApi';

// NEW
import ReviewModal from '../components/ReviewModal';
import type { ReviewDTO } from '../services/ReviewApi';

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<MyCourseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NEW: modal + review cache (for "Edit Review" label)
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [myReviews, setMyReviews] = useState<Record<string, ReviewDTO | null>>({});

  useEffect(() => {
    getMyCourses()
      .then(setCourses)
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  // NEW
  function openReview(courseId: string) {
    setSelectedCourseId(courseId);
    setReviewModalOpen(true);
  }

  // NEW: when a review is saved/updated, remember it so the button text flips to "Edit Review"
  function handleSaved(review: ReviewDTO) {
    setMyReviews((m) => ({ ...m, [review.courseId]: review }));
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-xl font-medium text-gray-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <div className="mb-4 text-red-500">
            <svg
              className="mx-auto h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-800">Error Loading Courses</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!courses.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-lg rounded-2xl bg-white p-12 text-center shadow-xl">
          <div className="mb-6 text-gray-300">
            <svg
              className="mx-auto h-24 w-24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="mb-4 text-2xl font-bold text-gray-800">No Courses Yet</h3>
          <p className="mb-6 text-gray-600">
            You haven't enrolled in any courses yet. Start your learning journey today!
          </p>
          <Link
            to="/student/dashboard"
            className="inline-block transform rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:-translate-y-1 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-800">My Courses</h1>
          <p className="text-lg text-gray-600">Continue your learning journey</p>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map(({ enrollmentId, course }) => (
            <div
              key={enrollmentId}
              className="group transform overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Thumbnail */}
              <div className="relative h-52 w-full overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                {/* Enrollment Badge */}
                <div className="absolute left-4 top-4 rounded-full bg-green-500 px-3 py-1 text-sm font-semibold text-white shadow-lg">
                  Enrolled
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <h2 className="mb-3 line-clamp-2 text-xl font-bold text-gray-800 transition-colors group-hover:text-blue-600">
                  {course.title}
                </h2>

                <p className="mb-6 line-clamp-3 flex-grow leading-relaxed text-gray-600">
                  {course.details}
                </p>

                <Link
                  to={`/student/purchased-course/${course._id}`}
                  className="mt-auto inline-block transform rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-center font-semibold text-white shadow-lg transition-all hover:-translate-y-1 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                >
                  Continue Learning
                </Link>

                {/* NEW: Rate & Review / Edit Review */}
                <button
                  onClick={() => openReview(course._id)}
                  className="mt-3 w-full rounded-xl border border-blue-200 bg-white px-4 py-2 font-semibold text-blue-700 hover:bg-blue-50"
                >
                  {myReviews[course._id] ? 'Edit Review' : 'Rate & Review'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* NEW: Modal mount point */}
        {selectedCourseId && (
          <ReviewModal
            courseId={selectedCourseId}
            open={reviewModalOpen}
            onClose={() => setReviewModalOpen(false)}
            onSaved={handleSaved}
          />
        )}
      </div>
    </div>
  );
}
