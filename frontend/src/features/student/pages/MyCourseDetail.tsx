// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { fetchModulesByCourseId, fetchTopicsByModuleId } from '../services/CourseApi';
// import type { Module, Topic } from '../../../types/course';

// const LIMIT = 5;

// const MyCourseDetail = () => {
//   const { courseId } = useParams<{ courseId: string }>();
//   const navigate = useNavigate();

//   const [modules, setModules] = useState<Module[]>([]);
//   const [topics, setTopics] = useState<Topic[]>([]);
//   const [selectedModuleId, setSelectedModuleId] = useState<string>('');
//   const [search, setSearch] = useState('');
//   const [debouncedSearch, setDebouncedSearch] = useState('');
//   const [page, setPage] = useState(1);
//   const [total, setTotal] = useState(0);

//   useEffect(() => {
//     if (courseId) {
//       fetchModulesByCourseId(courseId).then((res) => {
//         setModules(res);
//         if (res.length > 0) {
//           setSelectedModuleId(res[0]._id);
//         }
//       });
//     }
//   }, [courseId]);

//   useEffect(() => {
//     const delay = setTimeout(() => setDebouncedSearch(search), 500);
//     return () => clearTimeout(delay);
//   }, [search]);

//   useEffect(() => {
//     if (selectedModuleId) {
//       fetchTopicsByModuleId(selectedModuleId, debouncedSearch, page, LIMIT)
//         .then((res) => {
//           setTopics(res.topics);
//           setTotal(res.total);
//         })
//         .catch(console.error);
//     }
//   }, [selectedModuleId, debouncedSearch, page]);

//   const totalPages = Math.ceil(total / LIMIT);

//   return (
//     <div className="flex h-full gap-6 p-4">
//       {/* Sidebar */}
//       <div className="w-1/4 rounded-lg bg-white p-4 shadow-md">
//         <h2 className="mb-4 text-lg font-semibold">Course Modules</h2>
//         <div className="space-y-2">
//           {modules.map((mod, index) => (
//             <button
//               key={mod._id}
//               onClick={() => {
//                 setSelectedModuleId(mod._id);
//                 setPage(1);
//               }}
//               className={`w-full rounded-md border px-4 py-2 text-left ${
//                 selectedModuleId === mod._id
//                   ? 'border-green-400 bg-green-100'
//                   : 'border-gray-200 bg-gray-50'
//               }`}
//             >
//               <span className="font-medium text-green-600">{index + 1}. </span>
//               {mod.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1">
//         <div className="mb-4 flex items-center justify-between">
//           <h3 className="text-xl font-bold">Module Topics</h3>
//           <input
//             type="text"
//             placeholder="Search topics..."
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setPage(1);
//             }}
//             className="rounded border px-3 py-1 text-sm shadow-sm"
//           />
//         </div>

//         {topics.length === 0 ? (
//           <p>No topics found for this module.</p>
//         ) : (
//           <div className="space-y-4">
//             {topics.map((topic, index) => (
//               <div
//                 key={topic._id}
//                 className="flex items-start justify-between rounded-lg border bg-white p-4 shadow-sm"
//               >
//                 <div>
//                   <h4 className="text-md flex items-center gap-2 font-semibold">
//                     <span className="rounded-full bg-purple-500 px-2 py-1 text-sm text-white">
//                       {(page - 1) * LIMIT + index + 1}
//                     </span>
//                     {topic.title}
//                   </h4>
//                   <p className="mt-1 text-gray-600">{topic.description}</p>
//                 </div>
//                 <button
//                   onClick={() => navigate(`/student/topic/${topic._id}`)}
//                   className="rounded bg-emerald-500 px-3 py-1 text-sm text-white hover:bg-emerald-600"
//                 >
//                   View
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Pagination */}
//         <div className="mt-4 flex justify-end gap-2">
//           <button
//             disabled={page === 1}
//             onClick={() => setPage((p) => p - 1)}
//             className="rounded border px-3 py-1 disabled:opacity-50"
//           >
//             Prev
//           </button>
//           <span className="px-3 py-1">
//             {page} / {totalPages || 1}
//           </span>
//           <button
//             disabled={page === totalPages}
//             onClick={() => setPage((p) => p + 1)}
//             className="rounded border px-3 py-1 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyCourseDetail;
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchModulesByCourseId, fetchTopicsByModuleId } from '../services/CourseApi';
import type { Module, Topic } from '../../../types/course';

const LIMIT = 5;

const MyCourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [modules, setModules] = useState<Module[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (courseId) {
      fetchModulesByCourseId(courseId).then((res) => {
        setModules(res);
        if (res.length > 0) {
          setSelectedModuleId(res[0]._id);
        }
      });
    }
  }, [courseId]);

  useEffect(() => {
    const delay = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    if (selectedModuleId) {
      fetchTopicsByModuleId(selectedModuleId, debouncedSearch, page, LIMIT)
        .then((res) => {
          setTopics(res.topics);
          setTotal(res.total);
        })
        .catch(console.error);
    } else {
      setTopics([]);
      setTotal(0);
    }
  }, [selectedModuleId, debouncedSearch, page]);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold">Course Modules</h2>

          {/* Mobile: module selector */}
          <div className="sm:hidden">
            <label className="sr-only" htmlFor="mobile-module-select">Select module</label>
            <select
              id="mobile-module-select"
              value={selectedModuleId}
              onChange={(e) => { setSelectedModuleId(e.target.value); setPage(1); }}
              className="w-full rounded border px-3 py-2 text-sm"
            >
              {modules.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar (hidden on small screens) */}
          <aside className="hidden w-64 flex-shrink-0 rounded-lg bg-white p-4 shadow-md lg:block">
            <h3 className="mb-4 text-lg font-medium">Modules</h3>
            <div className="space-y-2">
              {modules.map((mod, index) => (
                <button
                  key={mod._id}
                  onClick={() => {
                    setSelectedModuleId(mod._id);
                    setPage(1);
                  }}
                  className={`w-full rounded-md border px-4 py-2 text-left text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                    selectedModuleId === mod._id
                      ? 'border-green-400 bg-green-100'
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                  type="button"
                  aria-pressed={selectedModuleId === mod._id}
                >
                  <span className="mr-2 inline-block w-5 font-medium text-green-600">{index + 1}.</span>
                  {mod.name}
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-bold">Module Topics</h3>

              <div className="w-full sm:w-1/2">
                <label className="sr-only" htmlFor="topic-search">Search topics</label>
                <input
                  id="topic-search"
                  type="text"
                  placeholder="Search topics..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full rounded border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </div>

            {/* If modules exist show currently selected module name (on mobile it's important) */}
            {modules.length > 0 && (
              <div className="mb-4 text-sm text-gray-600 sm:hidden">
                Viewing module:{' '}
                <span className="font-medium">
                  {modules.find((m) => m._id === selectedModuleId)?.name ?? '—'}
                </span>
              </div>
            )}

            {topics.length === 0 ? (
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <p className="text-gray-600">No topics found for this module.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topics.map((topic, index) => (
                  <div
                    key={topic._id}
                    className="flex flex-col items-start justify-between gap-3 rounded-lg border bg-white p-4 shadow-sm sm:flex-row"
                  >
                    <div className="flex-1">
                      <h4 className="mb-1 flex items-center gap-3 text-sm font-semibold text-gray-800">
                        <span className="inline-flex h-6 min-w-[28px] items-center justify-center rounded-full bg-purple-500 px-2 py-0.5 text-xs font-bold text-white">
                          {(page - 1) * LIMIT + index + 1}
                        </span>
                        <span>{topic.title}</span>
                      </h4>
                      <p className="text-sm text-gray-600">{topic.description}</p>
                    </div>

                    <div className="mt-3 w-full sm:mt-0 sm:w-auto">
                      <button
                        onClick={() => navigate(`/student/topic/${topic._id}`)}
                        className="w-full rounded bg-emerald-500 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        type="button"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="rounded border px-3 py-1 disabled:opacity-50"
                  type="button"
                  aria-disabled={page === 1}
                >
                  Prev
                </button>
                <span className="px-3 py-1 text-sm">
                  {page} / {totalPages || 1}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  className="rounded border px-3 py-1 disabled:opacity-50"
                  type="button"
                  aria-disabled={page === totalPages}
                >
                  Next
                </button>
              </div>

              {/* On small screens show module navigation below pagination for easier access */}
              <div className="w-full sm:w-auto">
                <div className="hidden sm:block" />
                <div className="sm:hidden mt-2 flex gap-2 overflow-x-auto">
                  {modules.map((mod, idx) => (
                    <button
                      key={mod._id}
                      onClick={() => { setSelectedModuleId(mod._id); setPage(1); }}
                      className={`whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium transition ${
                        selectedModuleId === mod._id
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      type="button"
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MyCourseDetail;
