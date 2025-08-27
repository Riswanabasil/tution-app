import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';

export default function TutorProtectedRoute() {
  const isAuthed = useSelector((s: RootState) => s.tutorAuth.isAuthenticated);
  return isAuthed ? <Outlet /> : <Navigate to="/tutor/login" replace />;
}
