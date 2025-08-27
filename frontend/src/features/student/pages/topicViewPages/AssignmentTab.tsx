import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchStudentAssignments } from '../../services/CourseApi';
import SubmitModal from './SubmitModal';

type Assignment = {
  _id: string;
  title: string;
  dueDate: string;
  description: string;
  status: 'not submitted' | 'pending' | 'verified' | 'expired';
};

export default function AssignmentTab() {
  const { topicId } = useParams<{ topicId: string }>();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (topicId) {
      fetchStudentAssignments(topicId)
        .then((res) => setAssignments(res))
        .catch((err) => console.error('Error fetching assignments:', err));
    }
  }, [topicId]);

  const handleOpenModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedAssignment(null);
    setOpenModal(false);
  };

  const getStatusConfig = (status: Assignment['status']) => {
    switch (status) {
      case 'expired':
        return {
          bg: 'bg-gradient-to-r from-red-100 to-red-200',
          text: 'text-red-700',
          icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          label: 'Expired',
        };
      case 'verified':
        return {
          bg: 'bg-gradient-to-r from-green-100 to-emerald-200',
          text: 'text-green-700',
          icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          label: 'Verified',
        };
      case 'pending':
        return {
          bg: 'bg-gradient-to-r from-yellow-100 to-amber-200',
          text: 'text-yellow-700',
          icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          label: 'Pending Review',
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-blue-100 to-indigo-200',
          text: 'text-blue-700',
          icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          ),
          label: 'Not Submitted',
        };
    }
  };

  const getActionButton = (assignment: Assignment) => {
    switch (assignment.status) {
      case 'not submitted':
        return (
          <button
            onClick={() => handleOpenModal(assignment)}
            className="inline-flex transform items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Submit Response</span>
          </button>
        );
      case 'pending':
        return (
          <button
            onClick={() => handleOpenModal(assignment)}
            className="inline-flex transform items-center space-x-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-yellow-600 hover:to-amber-600 hover:shadow-xl"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>Edit Response</span>
          </button>
        );
      case 'verified':
        return (
          <button
            onClick={() => handleOpenModal(assignment)}
            className="inline-flex transform items-center space-x-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <span>View Feedback</span>
          </button>
        );
      default:
        return null;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else if (diffDays <= 7) {
      return `Due in ${diffDays} days`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">Assignments</h1>
          <div className="h-1 w-32 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600"></div>
        </div>

        {assignments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-indigo-200">
              <svg
                className="h-12 w-12 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-700">No Assignments Available</h3>
            <p className="max-w-md text-center text-gray-500">
              No assignments have been posted for this topic yet. Check back later for new
              assignments.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {assignments.map((assignment, index) => {
              const statusConfig = getStatusConfig(assignment.status);
              const overdue =
                isOverdue(assignment.dueDate) && assignment.status === 'not submitted';

              return (
                <div
                  key={assignment._id}
                  className={`group transform rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl ${
                    overdue ? 'bg-red-50/30 ring-2 ring-red-200' : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600">
                          <svg
                            className="h-5 w-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">{assignment.title}</h2>
                      </div>

                      <div className="mb-3 flex items-center space-x-4">
                        <div
                          className={`inline-flex items-center space-x-2 rounded-full px-3 py-1 text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}
                        >
                          {statusConfig.icon}
                          <span>{statusConfig.label}</span>
                        </div>

                        <div
                          className={`inline-flex items-center space-x-2 rounded-full px-3 py-1 text-xs font-medium ${
                            overdue ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>{formatDueDate(assignment.dueDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="leading-relaxed text-gray-700">{assignment.description}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {/* Assignment ID: {assignment._id.slice(-8)} */}
                    </div>
                    {assignment.status !== 'expired' && getActionButton(assignment)}
                  </div>

                  {overdue && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
                      <div className="flex items-center space-x-2 text-red-700">
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
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                        <span className="text-sm font-medium">This assignment is overdue!</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {openModal && selectedAssignment && (
          <SubmitModal
            open={openModal}
            onClose={handleCloseModal}
            assignment={selectedAssignment}
            topicId={topicId!}
          />
        )}
      </div>
    </div>
  );
}
