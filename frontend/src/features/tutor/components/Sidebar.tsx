

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ currentPath }: { currentPath: string }) => {
  const location = useLocation();
  //   const [moduleItems, setModuleItems] = useState<Topic[] | null>(null);
  const [moduleItems, setModuleItems] = useState(null);

  useEffect(() => {
    if (currentPath.includes("/tutor/module")) {
      // In future: fetch module topics and setModuleItems(topics);
    } else {
      setModuleItems(null);
    }
  }, [currentPath]);

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-white to-gray-100 border-r shadow-sm p-4">
      <div className="text-2xl font-bold text-indigo-600 mb-6 tracking-tight">
        TechTute
      </div>

      {moduleItems ? (
        <>
          {/* <h2 className="text-lg font-semibold mb-3 text-gray-800">Module Topics</h2>
          <ul className="space-y-2">
            {moduleItems.map((topic: any) => (
              <li key={topic._id} className="text-gray-700 hover:text-indigo-600">
                {topic.title}
              </li>
            ))}
          </ul> */}
        </>
      ) : (
        <nav className="flex flex-col space-y-4 text-gray-700">
          <Link
            to="/tutor/dashboard"
            className={`hover:text-indigo-600 transition ${
              location.pathname === "/tutor/dashboard" ? "text-indigo-600 font-semibold" : ""
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/tutor/assignments"
            className={`hover:text-indigo-600 transition ${
              location.pathname === "/tutor/assignments" ? "text-indigo-600 font-semibold" : ""
            }`}
          >
            Assignments
          </Link>
        </nav>
      )}
    </aside>
  );
};

export default Sidebar;
