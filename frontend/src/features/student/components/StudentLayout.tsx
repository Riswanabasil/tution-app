
// src/layouts/StudentLayout.tsx
import { Outlet, Link } from 'react-router-dom'

export default function StudentLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-green-600">
            TechTute
          </Link>
          <ul className="flex space-x-6">
            <li><Link to="/student/dashboard" className="hover:text-green-600">Dashboard</Link></li>
            <li><Link to="/student/mycourse"   className="hover:text-green-600">My Courses</Link></li>
            <li><Link to="/student/profile"   className="hover:text-green-600">Profile</Link></li>
            <li><Link to="/logout"            className="text-red-500 hover:text-red-700">Logout</Link></li>
          </ul>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
