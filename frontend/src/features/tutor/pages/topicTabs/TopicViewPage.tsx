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

// import { useParams } from "react-router-dom";
// import NotesTab from "./NotesTab";
// import { useState } from "react";
// import AssignmentTab from "./AssignmentTab"

// export default function TopicViewPage() {
//   const { topicId } = useParams<{ topicId: string }>();
//   const [activeTab, setActiveTab] = useState<"notes" | "assignments" | "live">("notes");

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">Topic Details</h2>
//       <div className="flex space-x-4 mb-4 border-b pb-2">
//         <button onClick={() => setActiveTab("notes")} className={activeTab === "notes" ? "font-bold" : ""}>Notes</button>
//         <button onClick={() => setActiveTab("assignments")} className={activeTab === "assignments" ? "font-bold" : ""}>Assignments</button>
//         <button onClick={() => setActiveTab("live")} className={activeTab === "live" ? "font-bold" : ""}>Live Sessions</button>
//       </div>

//       {activeTab === "notes" && <NotesTab topicId={topicId!} />}
//       {activeTab === "assignments" && <AssignmentTab topicId={topicId!} />}
//       {activeTab === "live" && <div>LiveSessionsTab coming soon</div>}
//     </div>
//   );
// }

import { useParams } from "react-router-dom";
import NotesTab from "./NotesTab";
import { useState } from "react";
import AssignmentTab from "./AssignmentTab"

export default function TopicViewPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const [activeTab, setActiveTab] = useState<"notes" | "assignments" | "live">("notes");

  const tabs = [
    {
      id: "notes" as const,
      label: "Notes",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      description: "Study materials and documents"
    },
    {
      id: "assignments" as const,
      label: "Assignments",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      description: "Tasks and homework"
    },
    {
      id: "live" as const,
      label: "Live Sessions",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      description: "Virtual classroom sessions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Topic Overview
            </h2>
            <p className="text-slate-500 mt-1">Explore content, assignments, and live sessions</p>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          <div className="p-2">
            <nav className="flex space-x-1" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex-1 flex items-center justify-center gap-3 px-6 py-4 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/60'
                  }`}
                >
                  <div className={`transition-all duration-300 ${
                    activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'
                  }`}>
                    {tab.icon}
                  </div>
                  
                  <div className="flex flex-col items-start">
                    <span className="text-base font-semibold">{tab.label}</span>
                    <span className={`text-xs transition-all duration-300 ${
                      activeTab === tab.id 
                        ? 'text-white/80' 
                        : 'text-slate-400 group-hover:text-slate-500'
                    }`}>
                      {tab.description}
                    </span>
                  </div>

                  {/* Active indicator */}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white rounded-full shadow-lg"></div>
                  )}

                  {/* Hover effect overlay */}
                  <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                    activeTab !== tab.id 
                      ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100' 
                      : ''
                  }`}></div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          {/* Tab content header with animation */}
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50/50 to-white/50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg transition-all duration-300 ${
                activeTab === "notes" ? 'bg-indigo-100 text-indigo-600' :
                activeTab === "assignments" ? 'bg-emerald-100 text-emerald-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                {tabs.find(tab => tab.id === activeTab)?.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </h3>
                <p className="text-sm text-slate-500">
                  {tabs.find(tab => tab.id === activeTab)?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Content with fade-in animation */}
          <div className="p-6">
            <div className="animate-fadeIn">
              {activeTab === "notes" && <NotesTab topicId={topicId!} />}
              {activeTab === "assignments" && <AssignmentTab topicId={topicId!} />}
              {activeTab === "live" && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Live Sessions Coming Soon</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Interactive virtual classroom sessions will be available soon. Stay tuned for real-time learning experiences!
                  </p>
                  <div className="mt-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Under Development
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style> */}
    </div>
  );
}

