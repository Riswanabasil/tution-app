// import { useEffect, useState } from 'react'
// import { Link, useParams, useNavigate } from 'react-router-dom'
// import { fetchCourseDetails } from '../services/CourseApi'
// import type { CourseDetails } from '../../../types/course'
// import { PaymentButton } from '../components/PaymentButton'

// export default function CourseDetailPage() {
//   const { id } = useParams<{ id: string }>()
//   const nav = useNavigate()

//   const [course, setCourse] = useState<CourseDetails | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     if (!id) return
//     fetchCourseDetails(id)
//       .then(c => setCourse(c))
//       .catch(err => setError(err.message || 'Failed to load'))
//       .finally(() => setLoading(false))
//   }, [id])

//   if (loading) return <p className="p-6 text-center">Loading…</p>
//   if (error) return <p className="p-6 text-center text-red-600">Error: {error}</p>
//   if (!course) return <p className="p-6 text-center">No course found</p>

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <div className="container mx-auto max-w-7xl px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
//         {/* Breadcrumb */}
//         <nav className="col-span-1 lg:col-span-12 mb-4 text-sm text-gray-600">
//           <Link to="/student/dashboard" className="hover:underline">Courses</Link>
//           <span className="mx-2">/</span>
//           <span className="font-semibold">{course.title}</span>
//         </nav>

//         {/* Sidebar */}
//         <aside className="col-span-1 lg:col-span-3 sticky top-24 bg-white shadow rounded-lg p-6">
//           {/* <button
//             className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors mb-6"
//             onClick={() => {  }}
//           >
//             Enroll Now
//           </button> */}
//           <div className="mb-6">
//          <PaymentButton
//            courseId={course._id}
//            amount={course.price}
//            onSuccess={() => nav("/student/mycourse")}
//            onError={(err) => alert("Payment failed: " + err)}
//          />
//        </div>

//           <h3 className="text-lg font-semibold mb-4">Course Modules</h3>
//           <ul className="space-y-2">
//             {course.modules.map((m, idx) => (
//               <li
//                 key={m._id}
//                 className="flex items-center px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition"
//               >
//                 <span className="font-medium mr-2">{idx + 1}.</span>
//                 <span className="truncate">{m.name}</span>
//               </li>
//             ))}
//           </ul>
//         </aside>

//         {/* Main content */}
//         <main className="col-span-1 lg:col-span-9 space-y-8">
//           {/* Title & Instructor */}
//           <header className="bg-white shadow rounded-lg p-6">
//             <h1 className="text-3xl font-bold text-gray-800">{course.title}</h1>
//             <p className="mt-2 text-gray-600">
//               <span className="font-medium">Instructor:</span> {course.tutorName}
//             </p>
//           </header>

//           {/* Demo Video / Thumbnail */}
//           <div className="bg-white shadow rounded-lg overflow-hidden">
//             {course.demoVideoUrl ? (
//               <video
//                 src={course.demoVideoUrl}
//                 controls
//                 className="w-full aspect-video object-cover"
//               />
//             ) : (
//               <img
//                 src={course.thumbnail}
//                 alt={`${course.title} thumbnail`}
//                 className="w-full aspect-video object-cover"
//               />
//             )}
//           </div>

//           {/* Overview */}
//           <section className="bg-white shadow rounded-lg p-6">
//             <h2 className="text-2xl font-semibold mb-3 text-gray-800">Course Overview</h2>
//             <p className="text-gray-700 leading-relaxed whitespace-pre-line">
//               {course.details}
//             </p>
//           </section>

//           {/* Reviews */}
//           <section className="bg-white shadow rounded-lg p-6">
//             <h2 className="text-2xl font-semibold mb-4 text-gray-800">Reviews</h2>
//             {course.reviews?.length ? (
//               <ul className="space-y-6">
//                 {course.reviews.map((r, i) => (
//                   <li key={i} className="border-b pb-4">
//                     <div className="flex justify-between items-center">
//                       <span className="font-medium text-gray-800">{r.author}</span>
//                       <span className="text-sm text-gray-500">{r.when}</span>
//                     </div>
//                     <div className="flex mt-2">
//                       {Array.from({ length: 5 }).map((_, j) => (
//                         <svg
//                           key={j}
//                           className={`h-5 w-5 ${j < r.rating ? 'text-yellow-400' : 'text-gray-300'}`}
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.966z" />
//                         </svg>
//                       ))}
//                     </div>
//                     <p className="mt-2 text-gray-700 italic">“{r.comment}”</p>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-gray-500">No reviews yet.</p>
//             )}
//           </section>

//           {/* Back link */}
//           <div className="text-right">
//             <button
//               className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
//               onClick={() => nav(-1)}
//             >
//               ← Back to Courses
//             </button>
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }
// import { useEffect, useState } from 'react'
// import { Link, useParams, useNavigate } from 'react-router-dom'
// import { fetchCourseDetails } from '../services/CourseApi'
// import type { CourseDetails } from '../../../types/course'
// import { PaymentButton } from '../components/PaymentButton'

// export default function CourseDetailPage() {
//   const { id } = useParams<{ id: string }>()
//   const nav = useNavigate()

//   const [course, setCourse] = useState<CourseDetails | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     if (!id) return
//     fetchCourseDetails(id)
//       .then(c => setCourse(c))
//       .catch(err => setError(err.message || 'Failed to load'))
//       .finally(() => setLoading(false))
//   }, [id])

//   if (loading) return <p className="p-6 text-center">Loading…</p>
//   if (error) return <p className="p-6 text-center text-red-600">Error: {error}</p>
//   if (!course) return <p className="p-6 text-center">No course found</p>

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <div className="container mx-auto max-w-7xl px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
//         {/* Breadcrumb */}
//         <nav className="col-span-1 lg:col-span-12 mb-4 text-sm text-gray-600">
//           <Link to="/student/dashboard" className="hover:underline">Courses</Link>
//           <span className="mx-2">/</span>
//           <span className="font-semibold">{course.title}</span>
//         </nav>

//         {/* Sidebar */}
//         <aside className="col-span-1 lg:col-span-3 sticky top-24 bg-white shadow rounded-lg p-6">
//           <div className="mb-6">
//             <PaymentButton
//               courseId={course._id}
//               amount={course.price}
//               onSuccess={() => nav("/student/mycourse")}
//               onError={(err) => alert("Payment failed: " + err)}
//             />
//           </div>

//           <h3 className="text-lg font-semibold mb-4">Course Modules</h3>
//           <ul className="space-y-2">
//             {course.modules.map((m, idx) => (
//               <li key={m._id}>
//                 <p className="font-medium text-gray-800 mb-1">{idx + 1}. {m.name}</p>
//                 <ul className="pl-4 list-disc text-sm text-gray-600 space-y-1">
//                   {m.topics.map(t => (
//                     <li key={t._id}>
//                       <span className="font-semibold">{t.title}</span>
//                       <p className="ml-2">{t.description}</p>
//                     </li>
//                   ))}
//                 </ul>
//               </li>
//             ))}
//           </ul>
//         </aside>

//         {/* Main content */}
//         <main className="col-span-1 lg:col-span-9 space-y-8">
//           {/* Title & Tutor Info */}
//           <header className="bg-white shadow rounded-lg p-6">
//             <h1 className="text-3xl font-bold text-gray-800">{course.title}</h1>
//             <div className="flex items-center mt-4 gap-4">
//               {course.tutorProfilePic && (
//                 <img
//                   src={course.tutorProfilePic}
//                   alt="Tutor"
//                   className="w-12 h-12 rounded-full object-cover"
//                 />
//               )}
//               <div>
//                 <p className="font-semibold text-gray-700">Instructor: {course.tutorName}</p>
//                 <p className="text-sm text-gray-500">{course.tutorSummary}</p>
//               </div>
//             </div>
//             <div className="mt-3 text-sm text-gray-600">
//               <p><strong>Education:</strong> {course.tutorEducation || 'Not available'}</p>
//               <p><strong>Experience:</strong> {course.tutorExperience || 'Not available'}</p>
//             </div>
//           </header>

//           {/* Demo Video / Thumbnail */}
//           <div className="bg-white shadow rounded-lg overflow-hidden">
//             {course.demoVideoUrl ? (
//               <video
//                 src={course.demoVideoUrl}
//                 controls
//                 className="w-full aspect-video object-cover"
//               />
//             ) : (
//               <img
//                 src={course.thumbnail}
//                 alt={`${course.title} thumbnail`}
//                 className="w-full aspect-video object-cover"
//               />
//             )}
//           </div>

//           {/* Course Overview */}
//           <section className="bg-white shadow rounded-lg p-6">
//             <h2 className="text-2xl font-semibold mb-3 text-gray-800">Course Overview</h2>
//             <p className="text-gray-700 leading-relaxed whitespace-pre-line">
//               {course.details}
//             </p>
//           </section>

//           {/* Reviews */}
//           <section className="bg-white shadow rounded-lg p-6">
//             <h2 className="text-2xl font-semibold mb-4 text-gray-800">Reviews</h2>
//             {course.reviews?.length ? (
//               <ul className="space-y-6">
//                 {course.reviews.map((r, i) => (
//                   <li key={i} className="border-b pb-4">
//                     <div className="flex justify-between items-center">
//                       <span className="font-medium text-gray-800">{r.author}</span>
//                       <span className="text-sm text-gray-500">{r.when}</span>
//                     </div>
//                     <div className="flex mt-2">
//                       {Array.from({ length: 5 }).map((_, j) => (
//                         <svg
//                           key={j}
//                           className={`h-5 w-5 ${j < r.rating ? 'text-yellow-400' : 'text-gray-300'}`}
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.966z" />
//                         </svg>
//                       ))}
//                     </div>
//                     <p className="mt-2 text-gray-700 italic">“{r.comment}”</p>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-gray-500">No reviews yet.</p>
//             )}
//           </section>

//           {/* Back link */}
//           <div className="text-right">
//             <button
//               className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
//               onClick={() => nav(-1)}
//             >
//               ← Back to Courses
//             </button>
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }
import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { fetchCourseDetails } from '../services/CourseApi'
import type { CourseDetails } from '../../../types/course'
import { PaymentButton } from '../components/PaymentButton'
import { 
  ArrowLeft, 
  Play, 
  Star, 
  Clock, 
  BookOpen, 
  Award,
  User,
  GraduationCap,
  Briefcase,
  ChevronRight,
  Calendar,
  MessageCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()

  const [course, setCourse] = useState<CourseDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev)
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId)
      } else {
        newSet.add(moduleId)
      }
      return newSet
    })
  }

  useEffect(() => {
    if (!id) return
    fetchCourseDetails(id)
      .then(c => setCourse(c))
      .catch(err => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-medium">Loading course details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Course</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => nav(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Course Not Found</h3>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
          <button
            onClick={() => nav(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center space-x-2 text-sm">
          <Link 
            to="/student/dashboard" 
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Courses
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600 font-medium truncate">{course.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <main className="col-span-1 lg:col-span-8 space-y-8">
            {/* Hero Section */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              {/* Course Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
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
                      className="w-full aspect-video object-cover"
                      poster={course.thumbnail}
                    />
                    <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      <Play className="inline h-4 w-4 mr-1" />
                      Demo Video
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={course.thumbnail}
                      alt={`${course.title} thumbnail`}
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Play className="h-16 w-16 mx-auto mb-2 opacity-80" />
                        <p className="text-lg font-semibold">Course Preview</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Instructor Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <User className="h-6 w-6 mr-3 text-blue-600" />
                Meet Your Instructor
              </h2>
              <div className="flex items-start space-x-6">
                {course.tutorProfilePic && (
                  <img
                    src={course.tutorProfilePic}
                    alt="Instructor"
                    className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{course.tutorName}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{course.tutorSummary}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-gray-700">Education</span>
                      </div>
                      <p className="text-gray-600 text-sm">{course.tutorEducation || 'Not available'}</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Briefcase className="h-5 w-5 text-purple-600" />
                        <span className="font-semibold text-gray-700">Experience</span>
                      </div>
                      <p className="text-gray-600 text-sm">{course.tutorExperience || 'Not available'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <BookOpen className="h-6 w-6 mr-3 text-green-600" />
                Course Overview
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {course.details}
                </p>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
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
            </div>

            {/* Back Button */}
            <div className="text-center">
              <button
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
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
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-800 mb-2">
                    ₹{course.price}
                  </div>
                  <p className="text-gray-600">One-time purchase</p>
                   <PaymentButton
                  courseId={course._id}
                  amount={course.price}
                  onSuccess={() => nav("/student/mycourse")}
                  onError={(err) => alert("Payment failed: " + err)}
                />
                </div>
                
               

                {/* <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <Award className="h-5 w-5" />
                    <span className="font-semibold">Certificate included</span>
                  </div>
                </div> */}

                <div className="mt-6 pt-6 border-t border-gray-200">
  <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
    What's Included
  </h4>
  
  {/* Features Grid */}
  <div className="space-y-3">
    {/* Notes Available */}
    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="bg-blue-500 rounded-full p-2">
          <BookOpen className="h-4 w-4 text-white" />
        </div>
        <span className="font-medium text-blue-800">Notes Available</span>
      </div>
      <div className="flex items-center text-green-600 text-sm">
        <Award className="h-4 w-4 mr-1" />
        <span>Ready</span>
      </div>
    </div>

    {/* Live Session */}
    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100 hover:bg-red-100 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="bg-red-500 rounded-full p-2">
          <Play className="h-4 w-4 text-white" />
        </div>
        <span className="font-medium text-red-800">Live Session</span>
      </div>
      <div className="flex items-center text-red-600 text-sm">
        <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
        <span>Active</span>
      </div>
    </div>

    {/* Recorded Classes */}
    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="bg-purple-500 rounded-full p-2">
          <Play className="h-4 w-4 text-white" />
        </div>
        <span className="font-medium text-purple-800">Recorded Classes</span>
      </div>
      <div className="flex items-center text-green-600 text-sm">
        <Clock className="h-4 w-4 mr-1" />
        <span>24/7</span>
      </div>
    </div>
  </div>

  {/* Summary Stats */}
  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
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
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <BookOpen className="h-6 w-6 mr-3 text-blue-600" />
                  Course Modules
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {course.modules.map((m, idx) => (
                    <div key={m._id} className="border border-gray-200 rounded-xl overflow-hidden">
                      {/* Module Header - Clickable */}
                      <button
                        onClick={() => toggleModule(m._id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            {idx + 1}
                          </div>
                          <h4 className="font-semibold text-gray-800 flex-1">{m.name}</h4>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
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
                          <div className="p-4 space-y-3">
                            {m.topics.map((t, topicIdx) => (
                              <div key={t._id} className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                                <div className="flex items-start space-x-3">
                                  <div className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">
                                    {topicIdx + 1}
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-gray-800 mb-2">{t.title}</h5>
                                    <p className="text-sm text-gray-600 leading-relaxed">{t.description}</p>
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
  )
}