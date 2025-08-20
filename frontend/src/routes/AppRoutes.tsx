import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import StudentRoutes from "../features/student/routes";

import AdminRoutes from "../features/admin/routes";
import TutorRoutes from "../features/tutor/routes";
import NotFoundPage from "../components/NotFoundPage";
const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/student/*" element={<StudentRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path='/tutor/*' element={<TutorRoutes/>}/>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Router>
);

export default AppRoutes;
