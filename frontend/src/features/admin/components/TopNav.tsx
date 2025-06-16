
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
    navigate("/admin");
  };

  return (
    <div className="flex items-center justify-between bg-white shadow px-6 py-4">
      <h1 className="text-lg font-semibold">Admin Panel</h1>
      <div className="flex items-center gap-4">
        <p className="text-gray-600">Admin</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
