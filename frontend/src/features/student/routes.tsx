import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import ProtectedRoute from "./components/ProtectedRoute";
import CourseGridPage from "./pages/Dashboard";
import CourseDetailPage from "./pages/CourseDetailPage";
import StudentLayout from "./components/StudentLayout";
import MyCoursesPage from "./pages/MyCourses";
import MyCourseDetail from "./pages/MyCourseDetail";
import ProfilePage from "./pages/ProfilePage";
import TopicTabsLayout from "./pages/topicViewPages/TopicTabsLayout";
import NoteTab from "./pages/topicViewPages/NoteTab";
import AssignmentTab from "./pages/topicViewPages/AssignmentTab";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VideoTab from "./pages/topicViewPages/VideoTab";

const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="register" element={<Register />} />
      <Route path="verify-otp" element={<VerifyOtp />} />
      <Route path="login" element={<Login />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<StudentLayout />}>
          <Route path="dashboard" element={<CourseGridPage />} />
          <Route path="courses/:id" element={<CourseDetailPage />} />
          <Route path="mycourse" element={<MyCoursesPage />} />
          <Route
            path="purchased-course/:courseId"
            element={<MyCourseDetail />}
          />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="topic/:topicId" element={<TopicTabsLayout />}>
            <Route path="notes" element={<NoteTab />} />
            <Route path="assignments" element={<AssignmentTab />} />
            <Route path="videos" element={<VideoTab />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default StudentRoutes;
