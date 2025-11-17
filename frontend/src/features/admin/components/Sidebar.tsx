// import { Link, useLocation } from 'react-router-dom';

// const navItems = [
//   { label: 'Dashboard', path: '/admin/dashboard' },
//   { label: 'Student Management', path: '/admin/students' },
//   { label: 'Tutor Management', path: '/admin/tutors' },
//   { label: 'Course Management', path: '/admin/courses' },
// ];

// const Sidebar = () => {
//   const location = useLocation();

//   return (
//     <aside className="hidden h-full w-64 bg-gray-900 p-6 text-white md:block">
//       <h2 className="mb-8 text-2xl font-bold">Admin Panel</h2>
//       <nav className="flex flex-col space-y-4">
//         {navItems.map((item) => (
//           <Link
//             key={item.path}
//             to={item.path}
//             className={`hover:text-indigo-400 ${
//               location.pathname === item.path ? 'font-semibold text-indigo-400' : ''
//             }`}
//           >
//             {item.label}
//           </Link>
//         ))}
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;
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
    <aside className="w-full md:w-64 bg-gray-900 text-white p-4 md:p-6">
      <div className="flex items-center justify-between md:block">
        <h2 className="text-2xl font-bold md:mb-8">Admin Panel</h2>
        {/* On small screens the nav will be in the same row; on md+ it becomes vertical */}
        <nav className="flex md:flex-col flex-row md:space-y-4 space-x-4 md:space-x-0 mt-3 md:mt-0">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`hover:text-indigo-400 ${
                location.pathname === item.path ? 'font-semibold text-indigo-400' : ''
              } text-sm md:text-base`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
