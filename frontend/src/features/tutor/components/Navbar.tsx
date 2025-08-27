import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutTutorThunk } from '../../../redux/slices/tutorAuthSlice';
import type { AppDispatch, RootState } from '../../../redux/store';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((s: RootState) => s.tutorAuth);
  const handleLogout = async () => {
    try {
      await dispatch(logoutTutorThunk()).unwrap();
      navigate('/tutor/login', { replace: true });
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        {/* App Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-xl font-bold text-transparent">
              Welcome Tutor
            </h1>
            <div className="h-0.5 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-60"></div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2">
          {/* My Courses Link */}
          <Link
            to="/tutor/dashboard"
            className="group relative rounded-lg px-4 py-2 font-medium text-slate-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-600"
          >
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Dashboard
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 transform rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-transform duration-200 group-hover:scale-x-100"></div>
          </Link>
          <Link
            to="/tutor/courses"
            className="group relative rounded-lg px-4 py-2 font-medium text-slate-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-600"
          >
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              My Courses
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 transform rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-transform duration-200 group-hover:scale-x-100"></div>
          </Link>

          {/* Profile Link */}
          <Link
            to="/tutor/profile"
            className="group relative rounded-lg px-4 py-2 font-medium text-slate-700 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profile
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 transform rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-transform duration-200 group-hover:scale-x-100"></div>
          </Link>

          {/* Divider */}
          <div className="mx-2 h-6 w-px bg-slate-300"></div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="group relative rounded-lg px-4 py-2 font-medium text-slate-700 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
          >
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              {loading ? 'Logging out...' : 'Logout'}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 transform rounded-full bg-gradient-to-r from-red-500 to-pink-500 transition-transform duration-200 group-hover:scale-x-100"></div>
          </button>
        </nav>
      </div>

      {/* Subtle bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
    </header>
  );
};

export default Navbar;
