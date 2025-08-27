// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoute = () => {
//   const token = localStorage.getItem("accessToken");

//   return token ? <Outlet /> : <Navigate to="/student/login" replace />;
// };

// export default ProtectedRoute;

import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';

const ProtectedRoute = () => {
  const isAuthed = useSelector((s: RootState) => s.studentAuth.isAuthenticated);
  return isAuthed ? <Outlet /> : <Navigate to="/student/login" replace />;
};

export default ProtectedRoute;
