import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";

// const TutorLayout = () => {
//   const location = useLocation();

//   return (
//     <div className="flex h-screen">
//       <Sidebar currentPath={location.pathname} />
//       <div className="flex-1">
//         <Navbar />
//         <Outlet />
//       </div>
//     </div>
//   );
// };
// export default TutorLayout

const TutorLayout = () => {
 

  return (
    <div className="flex h-screen">
      
      <div className="flex-1">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};
export default TutorLayout