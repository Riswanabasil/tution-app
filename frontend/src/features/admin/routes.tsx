import { Route, Routes } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTutorPage from "./pages/AdminTutorPage";
import AdminLayout from "./components/AdminLayout";
import AdminStudentPage from "./pages/AdminStudentPage";
import AdminCourseList from "./pages/AdminCourseList";
import NotFoundPage from "../../components/NotFoundPage";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<AdminLogin />} />
      <Route path="/" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="tutors" element={<AdminTutorPage />} />
        <Route path="students" element={<AdminStudentPage />} />
         <Route path="courses" element={<AdminCourseList />} />
         <Route path="*" element={<NotFoundPage/>} />
      </Route>
    </Routes>
  );
};
export default AdminRoutes;
