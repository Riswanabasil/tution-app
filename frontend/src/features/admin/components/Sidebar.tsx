import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Student Management', path: '/admin/students' },
  { label: 'Tutor Management', path: '/admin/tutors' },
  { label: 'Course Management', path: '/admin/courses' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden h-full w-64 bg-gray-900 p-6 text-white md:block">
      <h2 className="mb-8 text-2xl font-bold">Admin Panel</h2>
      <nav className="flex flex-col space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`hover:text-indigo-400 ${
              location.pathname === item.path ? 'font-semibold text-indigo-400' : ''
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
