// import { useParams, NavLink, Outlet } from 'react-router-dom'

// const tabs = [
//   { label: 'Notes', path: 'notes' },
//   { label: 'Assignments', path: 'assignments' },
//   { label: 'Live Sessions', path: 'live-sessions' }
// ]

// export default function TopicViewPage() {
//   const { courseId, moduleId, topicId } = useParams()

//   const base = `/tutor/courses/${courseId}/content/modules/${moduleId}/topics/${topicId}`

//   return (
//     <div className="p-6">
//       <div className="border-b mb-6">
//         <nav className="flex gap-6">
//           {tabs.map(tab => (
//             <NavLink
//               key={tab.path}
//               to={`${base}/${tab.path}`}
//               className={({ isActive }) =>
//                 isActive ? 'font-semibold border-b-2 border-blue-600 pb-2' : 'text-gray-500 pb-2'
//               }
//             >
//               {tab.label}
//             </NavLink>
//           ))}
//         </nav>
//       </div>

//       <Outlet />
//     </div>
//   )
// }

import { useParams } from "react-router-dom";
import NotesTab from "./NotesTab";
import { useState } from "react";
// import AssignmentsTab, LiveSessionsTab when needed

export default function TopicViewPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const [activeTab, setActiveTab] = useState<"notes" | "assignments" | "live">("notes");

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Topic Details</h2>
      <div className="flex space-x-4 mb-4 border-b pb-2">
        <button onClick={() => setActiveTab("notes")} className={activeTab === "notes" ? "font-bold" : ""}>Notes</button>
        <button onClick={() => setActiveTab("assignments")} className={activeTab === "assignments" ? "font-bold" : ""}>Assignments</button>
        <button onClick={() => setActiveTab("live")} className={activeTab === "live" ? "font-bold" : ""}>Live Sessions</button>
      </div>

      {activeTab === "notes" && <NotesTab topicId={topicId!} />}
      {activeTab === "assignments" && <div>AssignmentsTab coming soon</div>}
      {activeTab === "live" && <div>LiveSessionsTab coming soon</div>}
    </div>
  );
}

