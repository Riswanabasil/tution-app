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
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col bg-gray-900 p-6 text-white">
        <h2 className="mb-8 text-2xl font-bold">Admin Panel</h2>
        <nav className="flex flex-col space-y-4">
          <a href="/admin/dashboard" className="hover:text-indigo-400">
            Dashboard
          </a>
          <a href="/admin/students" className="hover:text-indigo-400">
            Student Management
          </a>
          <a href="/admin/tutors" className="hover:text-indigo-400">
            Tutor Management
          </a>
          <a href="/admin/courses" className="hover:text-indigo-400">
            Course Management
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col bg-gray-100">
        {/* Top bar */}
        <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
          <h1 className="text-xl font-semibold">Welcome Admin</h1>
          <button
            className="rounded bg-red-500 px-4 py-1 text-white hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
