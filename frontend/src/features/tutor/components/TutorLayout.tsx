import { Outlet } from 'react-router-dom';

import Navbar from './Navbar';

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
export default TutorLayout;
