import { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchTopics, deleteTopic } from '../services/CourseApi';
import AddEditTopicForm from '../components/AddEditTopicForm';
import type { Topic } from '../../../types/topic';
import { useDebouncedValue } from '../../../hooks/useDebounce';

export default function ContentArea() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [search, setSearch] = useState('');
  const debouncedSearch=useDebouncedValue(search,400)
  const [page, setPage] = useState(1);
  const limit = 5;

  const [showModal, setShowModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  const loadTopics = () => {
    if (!moduleId) return;
    fetchTopics(moduleId).then(setAllTopics);
  };

  useEffect(() => {
    loadTopics();
  }, [moduleId]);

  const handleDelete = async (id: string) => {
    await deleteTopic(id);
    loadTopics();
  };

  const handleEdit = (topic: Topic) => {
    setEditingTopic(topic);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingTopic(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTopic(null);
  };

  const filtered = useMemo(() => {
    return allTopics.filter((topic) => topic.title.toLowerCase().includes(debouncedSearch.toLowerCase()));
  }, [allTopics, debouncedSearch]);

  const paginated = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / limit);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header Section */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Module Topics</h2>
              <p className="text-sm text-slate-500">Organize and manage your course content</p>
            </div>
          </div>

          <div className="flex w-full items-center gap-3 sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-4 w-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search topics..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white/70 py-2.5 pl-10 pr-4 shadow-sm backdrop-blur-sm transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:w-64"
              />
            </div>

            {/* Add Topic Button */}
            <button
              onClick={handleAdd}
              className="group flex transform items-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl"
            >
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
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
              Add Topic
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="overflow-hidden rounded-2xl border border-white/50 bg-white/80 shadow-xl backdrop-blur-sm">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <svg
                  className="h-8 w-8 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-800">No topics found</h3>
              <p className="text-center text-slate-500">
                {search
                  ? 'Try adjusting your search terms'
                  : 'Create your first topic to get started'}
              </p>
            </div>
          ) : (
            <div className="space-y-4 p-6">
              {paginated.map((t) => (
                <div
                  key={t._id}
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-center justify-between p-5">
                    <div className="flex flex-1 items-start gap-4">
                      {/* Topic Order Badge */}
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-lg">
                        {t.order}
                      </div>

                      {/* Topic Content */}
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-1 text-lg font-semibold text-slate-800 transition-colors duration-200 group-hover:text-slate-900">
                          {t.title}
                        </h3>
                        <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
                          {t.description}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 opacity-60 transition-opacity duration-200 group-hover:opacity-100">
                      <button
                        onClick={() => handleEdit(t)}
                        className="rounded-lg p-2 text-indigo-600 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-700"
                        title="Edit topic"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleDelete(t._id)}
                        className="rounded-lg p-2 text-red-600 transition-all duration-200 hover:bg-red-50 hover:text-red-700"
                        title="Delete topic"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>

                      <Link
                        to={`/tutor/topic/${t._id}`}
                        className="rounded-lg p-2 text-emerald-600 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700"
                        title="View topic"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20 transition-opacity duration-200 group-hover:opacity-40"></div>
                </div>
              ))}
            </div>
          )}

          {/* Enhanced Pagination */}
          {totalPages > 0 && (
            <div className="border-t border-slate-200 bg-gradient-to-r from-slate-50/50 to-white/50 px-6 py-4">
              <div className="flex items-center justify-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      className={`h-10 w-10 rounded-lg font-semibold transition-all duration-200 ${
                        page === pageNum
                          ? 'scale-105 transform bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                      }`}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              {totalPages > 1 && (
                <p className="mt-3 text-center text-sm text-slate-500">
                  Page {page} of {totalPages} • {filtered.length} topics
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {editingTopic ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    )}
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  {editingTopic ? 'Edit Topic' : 'Add New Topic'}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="max-h-[60vh] overflow-y-auto p-6">
              <AddEditTopicForm
                topicId={editingTopic?._id}
                onSuccess={() => {
                  closeModal();
                  loadTopics();
                }}
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 p-6">
              <button
                onClick={closeModal}
                className="rounded-lg px-6 py-2.5 font-medium text-slate-600 transition-all duration-200 hover:bg-slate-200 hover:text-slate-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
