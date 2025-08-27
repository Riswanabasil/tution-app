import { Outlet } from 'react-router-dom';
import ModuleSidebar from './ModuleSidebar';

export default function CourseContentLayout() {
  return (
    <div className="flex h-full">
      <aside className="w-64 overflow-auto border-r">
        <ModuleSidebar />
      </aside>
      <main className="flex-1 overflow-auto bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
}
