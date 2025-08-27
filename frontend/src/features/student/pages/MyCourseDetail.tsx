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
    }
  }, [selectedModuleId, debouncedSearch, page]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="flex h-full gap-6 p-4">
      {/* Sidebar */}
      <div className="w-1/4 rounded-lg bg-white p-4 shadow-md">
        <h2 className="mb-4 text-lg font-semibold">Course Modules</h2>
        <div className="space-y-2">
          {modules.map((mod, index) => (
            <button
              key={mod._id}
              onClick={() => {
                setSelectedModuleId(mod._id);
                setPage(1);
              }}
              className={`w-full rounded-md border px-4 py-2 text-left ${
                selectedModuleId === mod._id
                  ? 'border-green-400 bg-green-100'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <span className="font-medium text-green-600">{index + 1}. </span>
              {mod.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold">Module Topics</h3>
          <input
            type="text"
            placeholder="Search topics..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="rounded border px-3 py-1 text-sm shadow-sm"
          />
        </div>

        {topics.length === 0 ? (
          <p>No topics found for this module.</p>
        ) : (
          <div className="space-y-4">
            {topics.map((topic, index) => (
              <div
                key={topic._id}
                className="flex items-start justify-between rounded-lg border bg-white p-4 shadow-sm"
              >
                <div>
                  <h4 className="text-md flex items-center gap-2 font-semibold">
                    <span className="rounded-full bg-purple-500 px-2 py-1 text-sm text-white">
                      {(page - 1) * LIMIT + index + 1}
                    </span>
                    {topic.title}
                  </h4>
                  <p className="mt-1 text-gray-600">{topic.description}</p>
                </div>
                <button
                  onClick={() => navigate(`/student/topic/${topic._id}`)}
                  className="rounded bg-emerald-500 px-3 py-1 text-sm text-white hover:bg-emerald-600"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">
            {page} / {totalPages || 1}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyCourseDetail;
