import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchTopics } from '../services/CourseApi'
import type { Topic } from '../../../types/topic'

export default function ContentArea() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const [topics, setTopics] = useState<Topic[]>([])

  useEffect(() => {
    if (!moduleId) return
    fetchTopics(moduleId).then(setTopics)
  }, [moduleId])

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Topics</h2>
        <button className="px-3 py-1 bg-blue-600 text-white rounded">
          + Add Topic
        </button>
      </div>
      {topics.length === 0 ? (
        <p className="text-gray-500">No topics yet</p>
      ) : (
        <ul className="space-y-2">
          {topics.map(t => (
            <li
              key={t._id}
              className="flex justify-between items-center p-3 bg-white rounded shadow"
            >
              <span>
                {t.order}. {t.title}
              </span>
              <div className="space-x-2">
                <button className="text-blue-600">Edit</button>
                <button className="text-red-600">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}