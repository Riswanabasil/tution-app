import { Outlet, Link, useNavigate } from 'react-router-dom';
import { logoutStudentThunk } from '../../../redux/slices/studentAuthSlice';
import type { AppDispatch } from '../../../redux/store';
import { useDispatch } from 'react-redux';

export default function StudentLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = async () => {
    try {
      await dispatch(logoutStudentThunk()).unwrap();
      navigate('/student/login', { replace: true });
    } catch (e) {
      console.error('Logout failed', e);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                <span className="text-lg font-bold text-white">T</span>
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                TechTute
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden items-center space-x-8 md:flex">
              <Link
                to="/student/dashboard"
                className="group relative font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600"
              >
                Dashboard
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link
                to="/student/mycourse"
                className="group relative font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600"
              >
                My Courses
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link
                to="/student/profile"
                className="group relative font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600"
              >
                Profile
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="rounded-lg border border-red-500 px-4 py-2 font-medium text-red-500 transition-all duration-200 hover:bg-red-500 hover:text-white hover:shadow-md"
              >
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button className="text-gray-700 hover:text-blue-600 focus:outline-none">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
