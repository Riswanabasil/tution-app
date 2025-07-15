import { Link, useParams, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchModules } from '../services/CourseApi'
import type { Module } from '../../../types/module'

export default function ModuleSidebar() {
  const { courseId, moduleId } = useParams<{
    courseId: string
    moduleId?: string
  }>()
  const location     = useLocation()
  const [modules, setModules] = useState<Module[]>([])

  useEffect(() => {
    if (!courseId) return
    fetchModules(courseId).then(setModules)
  }, [courseId,location.pathname])

  return (
    <nav className="p-4 space-y-2">
      <button className="w-full py-2 bg-green-600 text-white rounded">
        <Link
  to="modules/new"
  className="block w-full text-center py-2 bg-green-600 text-white rounded mb-4"
>
  + Add Module
</Link>
      </button>
      {/* {modules.map(m => (
        <Link
          key={m._id}
          to={`modules/${m._id}`}
          className={`block px-3 py-2 rounded hover:bg-gray-100 ${
            moduleId === m._id ? 'bg-gray-200' : ''
          }`}
        >
          {m.order}. {m.name}
        </Link>
        
      ))} */}
      {modules.map(m => (
  <div key={m._id} className="flex justify-between items-center">
    <Link
      to={`modules/${m._id}`}
      className={`flex-1 px-3 py-2 rounded hover:bg-gray-100 ${moduleId === m._id ? 'bg-gray-200' : ''}`}
    >
      {m.order}. {m.name}
    </Link>
    <Link
      to={`modules/${m._id}/edit`}
      className="ml-2 text-blue-600"
    >
      Edit
    </Link>
  </div>
))}
    </nav>
  )
}