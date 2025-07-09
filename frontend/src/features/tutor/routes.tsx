import { Route, Routes} from "react-router-dom";
import TutorRegister from "./pages/Register";
import TutorVerificationStatus from "./pages/Verification-Status";
import TutorLogin from "./pages/Login";
import TutorVerification from "./pages/Verification";
// import CourseForm from "./pages/CourseForm";
// import TutorCoursesPage from "./pages/TutorCoursesPage";
import TutorLayout from "./components/TutorLayout";
import CourseListPage from "./pages/TutorCoursesPage";
import AddEditCoursePage from "./pages/CourseForm";

const TutorRoutes = () => {
 
  return (
    <Routes>
      <Route path="register" element={<TutorRegister />} />
      <Route path="verification" element={<TutorVerification />} />
      <Route path="verification-status" element={<TutorVerificationStatus />} />
      <Route path="login" element={<TutorLogin />} />
      <Route element={<TutorLayout />}>
      <Route path="courses" element={<CourseListPage/>} />
      <Route path="courses/add" element={<AddEditCoursePage />} />
      <Route path="courses/:id/edit" element={<AddEditCoursePage />} />
      </Route>
    </Routes>
  );
};

export default TutorRoutes;
