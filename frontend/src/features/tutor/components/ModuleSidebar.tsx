// import { Link, useParams, useLocation } from 'react-router-dom'
// import { useEffect, useState } from 'react'
// import { fetchModules } from '../services/CourseApi'
// import type { Module } from '../../../types/module'

// export default function ModuleSidebar() {
//   const { courseId, moduleId } = useParams<{
//     courseId: string
//     moduleId?: string
//   }>()
//   const location     = useLocation()
//   const [modules, setModules] = useState<Module[]>([])

//   useEffect(() => {
//     if (!courseId) return
//     fetchModules(courseId).then(setModules)
//   }, [courseId,location.pathname])

//   return (
//     <nav className="p-4 space-y-2">
//       <button className="w-full py-2 bg-green-600 text-white rounded">
//         <Link
//   to="modules/new"
//   className="block w-full text-center py-2 bg-green-600 text-white rounded mb-4"
// >
//   + Add Module
// </Link>
//       </button>
//       {modules.map(m => (
//   <div key={m._id} className="flex justify-between items-center">
//     <Link
//       to={`modules/${m._id}`}
//       className={`flex-1 px-3 py-2 rounded hover:bg-gray-100 ${moduleId === m._id ? 'bg-gray-200' : ''}`}
//     >
//       {m.order}. {m.name}
//     </Link>
//     <Link
//       to={`modules/${m._id}/edit`}
//       className="ml-2 text-blue-600"
//     >
//       Edit
//     </Link>
//   </div>
// ))}
//     </nav>
//   )
// }

import { Link, useParams, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchModules } from '../services/CourseApi'
import type { Module } from '../../../types/module'

export default function ModuleSidebar() {
  const { courseId, moduleId } = useParams<{
    courseId: string
    moduleId?: string
  }>()
  const location = useLocation()
  const [modules, setModules] = useState<Module[]>([])

  useEffect(() => {
    if (!courseId) return
    fetchModules(courseId).then(setModules)
  }, [courseId, location.pathname])

  return (
    <nav className="h-full bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 shadow-sm">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-1">Course Modules</h2>
          <div className="h-1 w-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
        </div>

        {/* Add Module Button */}
        <Link
          to="modules/new"
          className="group relative w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 mb-6"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Module
          <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </Link>

        {/* Modules List */}
        <div className="space-y-2">
          {modules.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-sm">No modules yet</p>
              <p className="text-xs mt-1">Create your first module to get started</p>
            </div>
          ) : (
            modules.map((m, ) => (
              <div 
                key={m._id} 
                className={`group relative rounded-lg border transition-all duration-200 hover:shadow-md ${
                  moduleId === m._id 
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-sm' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center">
                  {/* Module Order Badge */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ml-3 ${
                    moduleId === m._id 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                  }`}>
                    {m.order}
                  </div>

                  {/* Module Link */}
                  <Link
                    to={`modules/${m._id}`}
                    className="flex-1 px-4 py-3 text-left"
                  >
                    <div className={`font-medium transition-colors duration-200 ${
                      moduleId === m._id 
                        ? 'text-emerald-700' 
                        : 'text-slate-700 group-hover:text-slate-900'
                    }`}>
                      {m.name}
                    </div>
                  </Link>

                  {/* Edit Button */}
                  <Link
                    to={`modules/${m._id}/edit`}
                    className="flex-shrink-0 p-2 mr-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 group-hover:opacity-100 opacity-60"
                    title="Edit module"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                </div>

                {/* Active indicator */}
                {moduleId === m._id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-r-full"></div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </nav>
  )
}