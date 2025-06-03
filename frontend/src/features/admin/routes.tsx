import { Route, Routes } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";

import AdminDashboard from "./pages/AdminDashboard";
import UserList from "./pages/UserList";

const AdminRoutes=()=>{
    return(
        <Routes>
            <Route path="" element={<AdminLogin />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserList />} />
        </Routes>
    )
}
    export default AdminRoutes