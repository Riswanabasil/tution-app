import { Outlet, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../services/AdminApi";

const AdminLayout = () => {

   const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      localStorage.removeItem("adminAccessToken"); 
      navigate("/admin"); 
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav className="flex flex-col space-y-4">
          <a href="/admin/dashboard" className="hover:text-indigo-400">Dashboard</a>
          <a href="/admin/students" className="hover:text-indigo-400">Student Management</a>
          <a href="/admin/tutors" className="hover:text-indigo-400">Tutor Management</a>
          <a href="/admin/courses" className="hover:text-indigo-400">Course Management</a>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Top bar */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Welcome Admin</h1>
          <button className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"  onClick={handleLogout}>
           
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
