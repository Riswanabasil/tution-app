import { Route, Routes } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTutorPage from "./pages/AdminTutorPage";
import AdminLayout from "./components/AdminLayout";
import AdminStudentPage from "./pages/AdminStudentPage";
import AdminCourseList from "./pages/AdminCourseList";
import CourseForm from "./pages/CourseForm";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<AdminLogin />} />
      <Route path="/" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="tutors" element={<AdminTutorPage />} />
        <Route path="students" element={<AdminStudentPage />} />
         <Route path="courses" element={<AdminCourseList />} />
         <Route path="course/new" element={<CourseForm />} />
         <Route path="course/edit/:id" element={<CourseForm />} />
      </Route>
    </Routes>
  );
};
export default AdminRoutes;
