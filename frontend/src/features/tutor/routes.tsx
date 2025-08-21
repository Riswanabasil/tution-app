import { Route, Routes } from "react-router-dom";
import TutorRegister from "./pages/Register";
import TutorVerificationStatus from "./pages/Verification-Status";
import TutorLogin from "./pages/Login";
import TutorVerification from "./pages/Verification";
import TutorLayout from "./components/TutorLayout";
import CourseListPage from "./pages/TutorCoursesPage";
import AddEditCoursePage from "./pages/CourseForm";
import CourseContentLayout from "./components/CourseContentLayout";
import ContentArea from "./pages/ContentArea";
import AddEditModulePage from "./pages/AddEditModulePage";
import TutorProfilePage from "./pages/TutorProfilePage";
import TopicViewPage from "./pages/topicTabs/TopicViewPage";
import NotFoundPage from "../../components/NotFoundPage";
import TutorDashboardPage from "./pages/DashboardPage";

const TutorRoutes = () => {
  return (
    <Routes>
      <Route path="register" element={<TutorRegister />} />
      <Route path="verification" element={<TutorVerification />} />
      <Route path="verification-status" element={<TutorVerificationStatus />} />
      <Route path="login" element={<TutorLogin />} />
      <Route element={<TutorLayout />}>
        <Route path="dashboard" element={<TutorDashboardPage />} />
        <Route path="courses" element={<CourseListPage />} />
        <Route path="courses/add" element={<AddEditCoursePage />} />
        <Route path="courses/:id/edit" element={<AddEditCoursePage />} />
        <Route path="profile" element={<TutorProfilePage />} />
        <Route path="topic/:topicId" element={<TopicViewPage />} >
        </Route>
        <Route
          path="courses/:courseId/content"
          element={<CourseContentLayout />}
        >
          <Route index element={<div>Select a module from the left…</div>} />
          <Route path="modules">
            <Route path="new" element={<AddEditModulePage />} />
            <Route path=":moduleId/edit" element={<AddEditModulePage />} />
            <Route path=":moduleId" element={<ContentArea />} />
          </Route>
        </Route>

      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default TutorRoutes;
