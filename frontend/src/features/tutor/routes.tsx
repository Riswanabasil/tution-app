import { Route, Routes } from "react-router-dom";
import TutorRegister from "./pages/Register";
import TutorVerificationStatus from "./pages/Verification-Status";
import TutorLogin from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TutorVerification from "./pages/Verification";


const TutorRoutes=()=>{
    return(
        <Routes>
            <Route path="register" element={<TutorRegister/>}/>
            <Route path="verification" element={<TutorVerification/>}/>
            <Route path="verification-status" element={<TutorVerificationStatus/>}/>
            <Route path="login" element={<TutorLogin />} />
            <Route path="dashboard" element={<Dashboard />} />
        </Routes>
    )
}

export default TutorRoutes