import { Link, useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchModules } from '../services/CourseApi';
import type { Module } from '../../../types/module';

export default function ModuleSidebar() {
  const { courseId, moduleId } = useParams<{
    courseId: string;
    moduleId?: string;
  }>();
  const location = useLocation();
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    if (!courseId) return;
    fetchModules(courseId).then(setModules);
  }, [courseId, location.pathname]);

  return (
    <nav className="h-full border-r border-slate-200 bg-gradient-to-b from-slate-50 to-white shadow-sm">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="mb-1 text-lg font-semibold text-slate-800">Course Modules</h2>
          <div className="h-1 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
        </div>

        {/* Add Module Button */}
        <Link
          to="modules/new"
          className="group relative mb-6 flex w-full transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl"
        >
          <svg
            className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Module
          <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
        </Link>

        {/* Modules List */}
        <div className="space-y-2">
          {modules.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              <svg
                className="mx-auto mb-3 h-12 w-12 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-sm">No modules yet</p>
              <p className="mt-1 text-xs">Create your first module to get started</p>
            </div>
          ) : (
            modules.map((m) => (
              <div
                key={m._id}
                className={`group relative rounded-lg border transition-all duration-200 hover:shadow-md ${
                  moduleId === m._id
                    ? 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center">
                  {/* Module Order Badge */}
                  <div
                    className={`ml-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                      moduleId === m._id
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}
                  >
                    {m.order}
                  </div>

                  {/* Module Link */}
                  <Link to={`modules/${m._id}`} className="flex-1 px-4 py-3 text-left">
                    <div
                      className={`font-medium transition-colors duration-200 ${
                        moduleId === m._id
                          ? 'text-emerald-700'
                          : 'text-slate-700 group-hover:text-slate-900'
                      }`}
                    >
                      {m.name}
                    </div>
                  </Link>

                  {/* Edit Button */}
                  <Link
                    to={`modules/${m._id}/edit`}
                    className="mr-3 flex-shrink-0 rounded-lg p-2 text-slate-400 opacity-60 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-600 group-hover:opacity-100"
                    title="Edit module"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </Link>
                </div>

                {/* Active indicator */}
                {moduleId === m._id && (
                  <div className="absolute bottom-0 left-0 top-0 w-1 rounded-r-full bg-gradient-to-b from-emerald-500 to-teal-500"></div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </nav>
  );
}
