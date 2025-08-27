import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ currentPath }: { currentPath: string }) => {
  const location = useLocation();
  //   const [moduleItems, setModuleItems] = useState<Topic[] | null>(null);
  const [moduleItems, setModuleItems] = useState(null);

  useEffect(() => {
    if (currentPath.includes('/tutor/module')) {
      // In future: fetch module topics and setModuleItems(topics);
    } else {
      setModuleItems(null);
    }
  }, [currentPath]);

  return (
    <aside className="min-h-screen w-64 border-r bg-gradient-to-b from-white to-gray-100 p-4 shadow-sm">
      <div className="mb-6 text-2xl font-bold tracking-tight text-indigo-600">TechTute</div>

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
            className={`transition hover:text-indigo-600 ${
              location.pathname === '/tutor/dashboard' ? 'font-semibold text-indigo-600' : ''
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/tutor/assignments"
            className={`transition hover:text-indigo-600 ${
              location.pathname === '/tutor/assignments' ? 'font-semibold text-indigo-600' : ''
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
