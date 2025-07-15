import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { fetchCourseDetails } from '../services/CourseApi'
import type { CourseDetails } from '../../../types/course'
import { PaymentButton } from '../components/PaymentButton'

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()

  const [course, setCourse] = useState<CourseDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    fetchCourseDetails(id)
      .then(c => setCourse(c))
      .catch(err => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="p-6 text-center">Loading…</p>
  if (error) return <p className="p-6 text-center text-red-600">Error: {error}</p>
  if (!course) return <p className="p-6 text-center">No course found</p>

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Breadcrumb */}
        <nav className="col-span-1 lg:col-span-12 mb-4 text-sm text-gray-600">
          <Link to="/student/dashboard" className="hover:underline">Courses</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold">{course.title}</span>
        </nav>

        {/* Sidebar */}
        <aside className="col-span-1 lg:col-span-3 sticky top-24 bg-white shadow rounded-lg p-6">
          {/* <button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors mb-6"
            onClick={() => {  }}
          >
            Enroll Now
          </button> */}
          <div className="mb-6">
         <PaymentButton
           courseId={course._id}
           amount={course.price}
           onSuccess={() => nav("/student/mycourse")}
           onError={(err) => alert("Payment failed: " + err)}
         />
       </div>

          <h3 className="text-lg font-semibold mb-4">Course Modules</h3>
          <ul className="space-y-2">
            {course.modules.map((m, idx) => (
              <li
                key={m._id}
                className="flex items-center px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition"
              >
                <span className="font-medium mr-2">{idx + 1}.</span>
                <span className="truncate">{m.name}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <main className="col-span-1 lg:col-span-9 space-y-8">
          {/* Title & Instructor */}
          <header className="bg-white shadow rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-800">{course.title}</h1>
            <p className="mt-2 text-gray-600">
              <span className="font-medium">Instructor:</span> {course.tutorName}
            </p>
          </header>

          {/* Demo Video / Thumbnail */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {course.demoVideoUrl ? (
              <video
                src={course.demoVideoUrl}
                controls
                className="w-full aspect-video object-cover"
              />
            ) : (
              <img
                src={course.thumbnail}
                alt={`${course.title} thumbnail`}
                className="w-full aspect-video object-cover"
              />
            )}
          </div>

          {/* Overview */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">Course Overview</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {course.details}
            </p>
          </section>

          {/* Reviews */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Reviews</h2>
            {course.reviews?.length ? (
              <ul className="space-y-6">
                {course.reviews.map((r, i) => (
                  <li key={i} className="border-b pb-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">{r.author}</span>
                      <span className="text-sm text-gray-500">{r.when}</span>
                    </div>
                    <div className="flex mt-2">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <svg
                          key={j}
                          className={`h-5 w-5 ${j < r.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.966z" />
                        </svg>
                      ))}
                    </div>
                    <p className="mt-2 text-gray-700 italic">“{r.comment}”</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </section>

          {/* Back link */}
          <div className="text-right">
            <button
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              onClick={() => nav(-1)}
            >
              ← Back to Courses
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
