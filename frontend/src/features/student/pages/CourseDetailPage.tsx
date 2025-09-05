import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchCourseDetails } from '../services/CourseApi';
import type { CourseDetails } from '../../../types/course';
import { PaymentButton } from '../components/PaymentButton';
import {
  ArrowLeft,
  Play,
  Clock,
  BookOpen,
  Award,
  User,
  GraduationCap,
  Briefcase,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
// import {Star,Calendar,MessageCircle} from "lucide-react"
export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (!id) return;
    fetchCourseDetails(id)
      .then((c) => setCourse(c))
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-xl font-medium text-gray-600">Loading course details...</p>
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
          <h3 className="mb-2 text-xl font-bold text-gray-800">Error Loading Course</h3>
          <p className="mb-4 text-red-600">{error}</p>
          <button
            onClick={() => nav(-1)}
            className="rounded-xl bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <BookOpen className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <h3 className="mb-2 text-xl font-bold text-gray-800">Course Not Found</h3>
          <p className="mb-4 text-gray-600">The course you're looking for doesn't exist.</p>
          <button
            onClick={() => nav(-1)}
            className="rounded-xl bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center space-x-2 text-sm">
          <Link
            to="/student/dashboard"
            className="font-medium text-blue-600 transition-colors hover:text-blue-800"
          >
            Courses
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="truncate font-medium text-gray-600">{course.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Content */}
          <main className="col-span-1 space-y-8 lg:col-span-8">
            {/* Hero Section */}
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl">
              {/* Course Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                <h1 className="mb-4 text-4xl font-bold">{course.title}</h1>
                <div className="flex flex-wrap items-center gap-6 text-blue-100">
                  {/* <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>1,234 students</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>12 hours</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5" />
                    <span>4.8 rating</span>
                  </div> */}
                </div>
              </div>

              {/* Video/Thumbnail */}
              <div className="relative">
                {course.demoVideoUrl ? (
                  <div className="relative">
                    <video
                      src={course.demoVideoUrl}
                      controls
                      className="aspect-video w-full object-cover"
                      poster={course.thumbnail}
                    />
                    <div className="absolute left-4 top-4 rounded-full bg-black bg-opacity-50 px-3 py-1 text-sm text-white">
                      <Play className="mr-1 inline h-4 w-4" />
                      Demo Video
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={course.thumbnail}
                      alt={`${course.title} thumbnail`}
                      className="aspect-video w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                      <div className="text-center text-white">
                        <Play className="mx-auto mb-2 h-16 w-16 opacity-80" />
                        <p className="text-lg font-semibold">Course Preview</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Instructor Info */}
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
              <h2 className="mb-6 flex items-center text-2xl font-bold text-gray-800">
                <User className="mr-3 h-6 w-6 text-blue-600" />
                Meet Your Instructor
              </h2>
              <div className="flex items-start space-x-6">
                {course.tutorProfilePic && (
                  <img
                    src={course.tutorProfilePic}
                    alt="Instructor"
                    className="h-20 w-20 rounded-full border-4 border-blue-100 object-cover shadow-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="mb-2 text-xl font-bold text-gray-800">{course.tutorName}</h3>
                  <p className="mb-4 leading-relaxed text-gray-600">{course.tutorSummary}</p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl bg-blue-50 p-4">
                      <div className="mb-2 flex items-center space-x-2">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-gray-700">Education</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {course.tutorEducation || 'Not available'}
                      </p>
                    </div>
                    <div className="rounded-xl bg-purple-50 p-4">
                      <div className="mb-2 flex items-center space-x-2">
                        <Briefcase className="h-5 w-5 text-purple-600" />
                        <span className="font-semibold text-gray-700">Experience</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {course.tutorExperience || 'Not available'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Overview */}
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
              <h2 className="mb-6 flex items-center text-2xl font-bold text-gray-800">
                <BookOpen className="mr-3 h-6 w-6 text-green-600" />
                Course Overview
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="whitespace-pre-line leading-relaxed text-gray-700">
                  {course.details}
                </p>
              </div>
            </div>

            {/* Reviews */}
            {/* <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <MessageCircle className="h-6 w-6 mr-3 text-yellow-600" />
                Student Reviews
              </h2>
              {course.reviews?.length ? (
                <div className="space-y-6">
                  {course.reviews.map((r, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {r.author.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{r.author}</h4>
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, j) => (
                                  <Star
                                    key={j}
                                    className={`h-4 w-4 ${j < r.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">{r.rating}/5</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {r.when}
                        </div>
                      </div>
                      <p className="text-gray-700 italic">"{r.comment}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div> */}

            {/* Back Button */}
            <div className="text-center">
              <button
                className="inline-flex items-center space-x-2 rounded-xl bg-gray-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-gray-700 hover:shadow-xl"
                onClick={() => nav(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Courses</span>
              </button>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="col-span-1 lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              {/* Purchase Card */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
                <div className="mb-6 text-center">
                  <div className="mb-2 text-4xl font-bold text-gray-800">₹{course.price}</div>
                  <p className="text-gray-600">One-time purchase</p>
                  <PaymentButton
                    courseId={course._id}
                    amount={course.price}
                    onSuccess={() => nav('/student/mycourse')}
                    onError={(err) => {
                      let status: number | undefined;
                      if (axios.isAxiosError(err)) {
                        status = err.response?.status;
                      }
                      if (status === 409) {
                        toast.info('You already purchased this course. Redirecting to My Courses…');

                        setTimeout(() => nav('/student/mycourse'), 800);
                        return;
                      }
                    }}
                  />
                </div>

                {/* <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <Award className="h-5 w-5" />
                    <span className="font-semibold">Certificate included</span>
                  </div>
                </div> */}

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h4 className="mb-4 text-center text-lg font-semibold text-gray-800">
                    What's Included
                  </h4>

                  {/* Features Grid */}
                  <div className="space-y-3">
                    {/* Notes Available */}
                    <div className="flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50 p-3 transition-colors hover:bg-blue-100">
                      <div className="flex items-center space-x-3">
                        <div className="rounded-full bg-blue-500 p-2">
                          <BookOpen className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium text-blue-800">Notes Available</span>
                      </div>
                      <div className="flex items-center text-sm text-green-600">
                        <Award className="mr-1 h-4 w-4" />
                        <span>Ready</span>
                      </div>
                    </div>

                    {/* Live Session */}
                    <div className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 p-3 transition-colors hover:bg-red-100">
                      <div className="flex items-center space-x-3">
                        <div className="rounded-full bg-red-500 p-2">
                          <Play className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium text-red-800">Live Session</span>
                      </div>
                      <div className="flex items-center text-sm text-red-600">
                        <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
                        <span>Active</span>
                      </div>
                    </div>

                    {/* Recorded Classes */}
                    <div className="flex items-center justify-between rounded-lg border border-purple-100 bg-purple-50 p-3 transition-colors hover:bg-purple-100">
                      <div className="flex items-center space-x-3">
                        <div className="rounded-full bg-purple-500 p-2">
                          <Play className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium text-purple-800">Recorded Classes</span>
                      </div>
                      <div className="flex items-center text-sm text-green-600">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>24/7</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div className="mt-4 rounded-lg bg-gray-50 p-3">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <div className="font-bold text-blue-600">50+</div>
                        <div className="text-gray-600">Notes</div>
                      </div>
                      <div>
                        <div className="font-bold text-red-600">Live</div>
                        <div className="text-gray-600">Sessions</div>
                      </div>
                      <div>
                        <div className="font-bold text-purple-600">100+</div>
                        <div className="text-gray-600">Hours</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Modules */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
                <h3 className="mb-6 flex items-center text-xl font-bold text-gray-800">
                  <BookOpen className="mr-3 h-6 w-6 text-blue-600" />
                  Course Modules
                </h3>
                <div className="max-h-96 space-y-3 overflow-y-auto">
                  {course.modules.map((m, idx) => (
                    <div key={m._id} className="overflow-hidden rounded-xl border border-gray-200">
                      {/* Module Header - Clickable */}
                      <button
                        onClick={() => toggleModule(m._id)}
                        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                            {idx + 1}
                          </div>
                          <h4 className="flex-1 font-semibold text-gray-800">{m.name}</h4>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">
                            {m.topics.length} topics
                          </span>
                          {expandedModules.has(m._id) ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </button>

                      {/* Module Topics - Collapsible */}
                      {expandedModules.has(m._id) && (
                        <div className="border-t border-gray-200 bg-gray-50">
                          <div className="space-y-3 p-4">
                            {m.topics.map((t, topicIdx) => (
                              <div
                                key={t._id}
                                className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
                              >
                                <div className="flex items-start space-x-3">
                                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-600">
                                    {topicIdx + 1}
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="mb-2 font-semibold text-gray-800">{t.title}</h5>
                                    <p className="text-sm leading-relaxed text-gray-600">
                                      {t.description}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
