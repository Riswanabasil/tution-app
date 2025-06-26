import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("tutorAccessToken");
    navigate("/tutor/login");
  };

  return (
    <header className="w-full bg-white shadow-sm px-6 py-3 flex justify-between items-center">
      {/* App Brand */}
      <h1 className="text-2xl font-bold text-indigo-600 tracking-wide">Welcome Tutor</h1>

      <div className="flex items-center gap-4">
        {/* Profile Initial (static for now) */}
        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
          T
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-700 font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
