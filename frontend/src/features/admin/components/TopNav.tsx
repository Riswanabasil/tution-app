import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('adminRefreshToken');
    navigate('/admin');
  };

  return (
    <div className="flex items-center justify-between bg-white px-6 py-4 shadow">
      <h1 className="text-lg font-semibold">Admin Panel</h1>
      <div className="flex items-center gap-4">
        <p className="text-gray-600">Admin</p>
        <button
          onClick={handleLogout}
          className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
