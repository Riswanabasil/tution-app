import { NavLink, Outlet, useParams } from "react-router-dom";

const tabs = [
  { name: "Notes", path: "notes" },
  { name: "Assignments", path: "assignments" },
  { name: "Sessions", path: "sessions" },
  { name: "Recorded", path: "recorded" },
];

const TopicTabsLayout = () => {
  const { topicId } = useParams();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Topic Resources</h2>

      <div className="flex space-x-4 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <NavLink
            key={tab.name}
            to={`/student/topic/${topicId}/${tab.path}`}
            className={({ isActive }) =>
              `px-4 py-2 font-medium ${
                isActive ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"
              }`
            }
          >
            {tab.name}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  );
};

export default TopicTabsLayout;
