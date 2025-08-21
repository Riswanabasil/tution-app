import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutTutorThunk } from "../../../redux/slices/tutorAuthSlice";
import type { AppDispatch, RootState } from "../../../redux/store";

const Navbar = () => {
  const navigate = useNavigate();
const dispatch = useDispatch<AppDispatch>();
const { loading } = useSelector((s: RootState) => s.tutorAuth);
 const handleLogout = async () => {
     try {
       await dispatch(logoutTutorThunk()).unwrap();
       navigate("/tutor/login", { replace: true });
     } catch (e) {
       console.error("Logout failed", e);
     }
   }

  return (
    <header className="w-full bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        {/* App Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome Tutor
            </h1>
            <div className="h-0.5 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-60"></div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2">
          {/* My Courses Link */}
          <Link 
            to="/tutor/dashboard" 
            className="group relative px-4 py-2 rounded-lg font-medium text-slate-700 hover:text-emerald-600 transition-all duration-200 hover:bg-emerald-50"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Dashboard
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
          </Link>
          <Link 
            to="/tutor/courses" 
            className="group relative px-4 py-2 rounded-lg font-medium text-slate-700 hover:text-emerald-600 transition-all duration-200 hover:bg-emerald-50"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              My Courses
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
          </Link>

          {/* Profile Link */}
          <Link 
            to="/tutor/profile" 
            className="group relative px-4 py-2 rounded-lg font-medium text-slate-700 hover:text-blue-600 transition-all duration-200 hover:bg-blue-50"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
          </Link>

          {/* Divider */}
          <div className="w-px h-6 bg-slate-300 mx-2"></div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="group relative px-4 py-2 rounded-lg font-medium text-slate-700 hover:text-red-600 transition-all duration-200 hover:bg-red-50"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {loading ? "Logging out..." : "Logout"}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
          </button>
        </nav>
      </div>

      {/* Subtle bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
    </header>
  );
};

export default Navbar;
