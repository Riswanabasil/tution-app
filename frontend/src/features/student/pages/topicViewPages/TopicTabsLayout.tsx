import { NavLink, Outlet, useParams } from "react-router-dom";

const tabs = [
  { 
    name: "Notes", 
    path: "notes",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    description: "Study materials and documents"
  },
  { 
    name: "Assignments", 
    path: "assignments",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 8h6m-6 4h6" />
      </svg>
    ),
    description: "Tasks and submissions"
  },
  { 
    name: "Sessions", 
    path: "sessions",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    description: "Live classes and meetings"
  },
  { 
    name: "Recorded", 
    path: "recorded",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    description: "Video recordings and replays"
  },
];

const TopicTabsLayout = () => {
  const { topicId } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100">
      {/* Header Section */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Topic Resources</h1>
              <p className="text-gray-600 mt-1">Explore your learning materials and activities</p>
            </div>
          </div>

          {/* Enhanced Tab Navigation */}
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {tabs.map((tab, index) => (
              <NavLink
                key={tab.name}
                to={`/student/topic/${topicId}/${tab.path}`}
                className={({ isActive }) =>
                  `group relative flex items-center space-x-3 px-6 py-4 rounded-2xl font-medium transition-all duration-300 ease-out transform hover:scale-105 ${
                    isActive 
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25" 
                      : "bg-white/60 text-gray-700 hover:bg-white/80 hover:text-indigo-600 border border-white/40 shadow-sm"
                  }`
                }
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {({ isActive }) => (
                  <>
                    <div className={`flex-shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                      {tab.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{tab.name}</span>
                      <span className={`text-xs hidden sm:block ${isActive ? 'text-indigo-100' : 'text-gray-500 group-hover:text-indigo-500'}`}>
                        {tab.description}
                      </span>
                    </div>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-600/20 animate-pulse"></div>
                    )}
                    
                    {/* Hover glow effect */}
                    {!isActive && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 to-purple-600/0 group-hover:from-indigo-500/10 group-hover:to-purple-600/10 transition-all duration-300"></div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-indigo-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-16 w-32 h-32 bg-purple-200/30 rounded-full blur-xl"></div>
        
        {/* Outlet container */}
        <div className="relative z-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default TopicTabsLayout;
