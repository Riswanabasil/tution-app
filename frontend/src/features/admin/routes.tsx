import { Route, Routes } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

import AdminTutorPage from "./pages/AdminTutorPage";
import AdminLayout from "./components/AdminLayout";
import AdminStudentPage from "./pages/AdminStudentPage";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<AdminLogin />} />
      <Route path="/" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        {/* <Route path="users" element={<UserList />} /> */}
        <Route path="tutors" element={<AdminTutorPage />} />
        <Route path="students" element={<AdminStudentPage />} />
      </Route>
    </Routes>
  );
};
export default AdminRoutes;
