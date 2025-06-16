
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Student Management", path: "/admin/students" },
  { label: "Tutor Management", path: "/admin/tutors" },
  { label: "Course Management", path: "/admin/courses" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-gray-900 text-white p-6 hidden md:block h-full">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
      <nav className="flex flex-col space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`hover:text-indigo-400 ${
              location.pathname === item.path ? "text-indigo-400 font-semibold" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
