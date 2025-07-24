// import { useParams } from 'react-router-dom'
// import { useEffect, useState } from 'react'
// import { fetchTopics } from '../services/CourseApi'
// import type { Topic } from '../../../types/topic'

// export default function ContentArea() {
//   const { moduleId } = useParams<{ moduleId: string }>()
//   const [topics, setTopics] = useState<Topic[]>([])

//   useEffect(() => {
//     if (!moduleId) return
//     fetchTopics(moduleId).then(setTopics)
//   }, [moduleId])

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Topics</h2>
//         <button className="px-3 py-1 bg-blue-600 text-white rounded">
//           + Add Topic
//         </button>
//       </div>
//       {topics.length === 0 ? (
//         <p className="text-gray-500">No topics yet</p>
//       ) : (
//         <ul className="space-y-2">
//           {topics.map(t => (
//             <li
//               key={t._id}
//               className="flex justify-between items-center p-3 bg-white rounded shadow"
//             >
//               <span>
//                 {t.order}. {t.title}
//               </span>
//               <div className="space-x-2">
//                 <button className="text-blue-600">Edit</button>
//                 <button className="text-red-600">Delete</button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   )
// }

// src/features/tutor/pages/ContentArea.tsx

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchTopics, deleteTopic } from "../services/CourseApi";
import AddEditTopicForm from "../components/AddEditTopicForm";
import type { Topic } from "../../../types/topic";

export default function ContentArea() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  const loadTopics = () => {
    if (!moduleId) return;
    fetchTopics(moduleId).then(setTopics);
  };

  useEffect(() => {
    loadTopics();
  }, [moduleId]);

  const handleDelete = async (id: string) => {
    await deleteTopic(id);
    loadTopics();
  };

  const handleEdit = (topic: Topic) => {
    setEditingTopic(topic);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingTopic(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTopic(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Topics</h2>
        <button
          onClick={handleAdd}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          + Add Topic
        </button>
      </div>

      {topics.length === 0 ? (
        <p className="text-gray-500">No topics yet</p>
      ) : (
        <ul className="space-y-2">
          {topics.map((t) => (
            <li
              key={t._id}
              className="flex justify-between items-center p-3 bg-white rounded shadow"
            >
              <div>
                <span className="font-medium">
                  [{t.order}] {t.title}
                </span>
                <div className="text-sm text-gray-600">{t.description}</div>
              </div>
              <div className="space-x-2">
                <button onClick={() => handleEdit(t)} className="text-blue-600">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t._id)}
                  className="text-red-600"
                >
                  Delete
                </button>
                <button className="text-green-600">
                  <Link
                    to={`/tutor/topic/${t._id}`}
                    className="text-green-600 hover:underline text-sm"
                  >
                    view
                  </Link>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">
              {editingTopic ? "Edit Topic" : "Add Topic"}
            </h3>
            <AddEditTopicForm
              topicId={editingTopic?._id}
              onSuccess={() => {
                closeModal();
                loadTopics();
              }}
            />
            <div className="mt-4 text-right">
              <button
                onClick={closeModal}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
