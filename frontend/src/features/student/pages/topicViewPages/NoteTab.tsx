import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchNotesByTopicId } from '../../services/CourseApi';

interface Note {
  _id: string;
  pdfUrls: string[];
  uploadedAt: string;
}

const NoteTab = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (topicId) {
      fetchNotesByTopicId(topicId).then(setNotes).catch(console.error);
    }
  }, [topicId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-gray-800">Study Notes</h2>
          <div className="h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        </div>

        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-200">
              <svg
                className="h-12 w-12 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-700">No Notes Available</h3>
            <p className="max-w-md text-center text-gray-500">
              No study notes have been uploaded for this topic yet. Check back later for new
              materials.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {notes.map((note, index) => (
              <div
                key={note._id}
                className="group transform rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Study Materials</h3>
                      <p className="text-sm text-gray-500">
                        {note.pdfUrls.length} PDF{note.pdfUrls.length > 1 ? 's' : ''} available
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                      <svg
                        className="mr-1 h-3 w-3"
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
                      {new Date(note.uploadedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {note.pdfUrls.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex items-center justify-between rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 transition-all duration-200 hover:border-blue-200 hover:from-blue-100 hover:to-indigo-100"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-600">
                          <svg
                            className="h-4 w-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">PDF Document {i + 1}</p>
                          <p className="text-sm text-gray-500">Click to view in new tab</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-blue-600 group-hover/link:text-blue-700">
                        <span className="text-sm font-medium">Open</span>
                        <svg
                          className="h-4 w-4 transform transition-transform duration-200 group-hover/link:translate-x-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteTab;
