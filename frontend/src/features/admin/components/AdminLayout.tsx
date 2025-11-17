// import { Outlet, useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import type { AppDispatch } from '../../../redux/store';
// import { logoutAdminThunk } from '../../../redux/slices/adminSlice';

// const AdminLayout = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();

//   const handleLogout = async () => {
//     try {
//       await dispatch(logoutAdminThunk()).unwrap();
//       navigate('/admin');
//     } catch (err) {
//       console.error('Logout failed', err);
//     }
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <aside className="flex w-64 flex-col bg-gray-900 p-6 text-white">
//         <h2 className="mb-8 text-2xl font-bold">Admin Panel</h2>
//         <nav className="flex flex-col space-y-4">
//           <a href="/admin/dashboard" className="hover:text-indigo-400">
//             Dashboard
//           </a>
//           <a href="/admin/students" className="hover:text-indigo-400">
//             Student Management
//           </a>
//           <a href="/admin/tutors" className="hover:text-indigo-400">
//             Tutor Management
//           </a>
//           <a href="/admin/courses" className="hover:text-indigo-400">
//             Course Management
//           </a>
//         </nav>
//       </aside>

//       {/* Main content */}
//       <div className="flex flex-1 flex-col bg-gray-100">
//         {/* Top bar */}
//         <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
//           <h1 className="text-xl font-semibold">Welcome Admin</h1>
//           <button
//             className="rounded bg-red-500 px-4 py-1 text-white hover:bg-red-600"
//             onClick={handleLogout}
//           >
//             Logout
//           </button>
//         </header>

//         {/* Page content */}
//         <main className="flex-1 overflow-y-auto p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../redux/store';
import { logoutAdminThunk } from '../../../redux/slices/adminSlice';

const AdminLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    try {
      await dispatch(logoutAdminThunk()).unwrap();
      navigate('/admin');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <aside className="flex md:w-64 w-full md:flex-col flex-row items-center bg-gray-900 p-4 md:p-6 text-white">
        <h2 className="md:mb-8 mb-4 text-2xl font-bold text-center md:text-left">Admin Panel</h2>
        <nav className="flex md:flex-col flex-row md:space-y-4 space-x-6 md:space-x-0">
          <a href="/admin/dashboard" className="hover:text-indigo-400 text-sm md:text-base md:w-full">
            Dashboard
          </a>
          <a href="/admin/students" className="hover:text-indigo-400 text-sm md:text-base md:w-full">
            Student Management
          </a>
          <a href="/admin/tutors" className="hover:text-indigo-400 text-sm md:text-base md:w-full">
            Tutor Management
          </a>
          <a href="/admin/courses" className="hover:text-indigo-400 text-sm md:text-base md:w-full">
            Course Management
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Top bar */}
        <header className="flex items-center justify-between bg-white px-4 md:px-6 py-3 md:py-4 shadow">
          <h1 className="text-lg md:text-xl font-semibold">Welcome Admin</h1>
          <button
            className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600 text-sm md:text-base"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
