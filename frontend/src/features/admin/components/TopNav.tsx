// import { useNavigate } from 'react-router-dom';

// const Topbar = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('adminAccessToken');
//     localStorage.removeItem('adminRefreshToken');
//     navigate('/admin');
//   };

//   return (
//     <div className="flex items-center justify-between bg-white px-6 py-4 shadow">
//       <h1 className="text-lg font-semibold">Admin Panel</h1>
//       <div className="flex items-center gap-4">
//         <p className="text-gray-600">Admin</p>
//         <button
//           onClick={handleLogout}
//           className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Topbar;
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('adminRefreshToken');
    navigate('/admin');
  };

  return (
    <div className="bg-white shadow">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <h1 className="text-base sm:text-lg font-semibold">Admin Panel</h1>

        <div className="flex items-center gap-3">
          <p className="text-gray-600 text-sm sm:text-base">Admin</p>
          <button
            onClick={handleLogout}
            className="rounded bg-red-500 px-3 py-1 text-sm sm:text-base text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
