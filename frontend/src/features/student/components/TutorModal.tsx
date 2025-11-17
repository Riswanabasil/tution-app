import type { TutorProfileDTO } from "../services/ReviewApi";

type Props = {
  open: boolean;
  onClose: () => void;
  tutor?: TutorProfileDTO | null;
  loading?: boolean;
  error?: string | null;
};

export default function TutorModal({ open, onClose, tutor, loading, error }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />
      <div className="relative z-10 max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-xl font-semibold text-gray-800">Tutor Details</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2"></div>
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 p-4 text-red-700">{error}</div>
        ) : !tutor ? (
          <div className="text-gray-600">No tutor information available.</div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-lg font-semibold text-gray-800">{tutor.name}</p>
              {/* <p className="text-sm text-gray-500">ID: {tutor.id}</p> */}
            </div>

            {tutor.summary && (
              <div>
                <h4 className="mb-1 text-sm font-medium text-gray-700">Summary</h4>
                <p className="text-gray-600">{tutor.summary}</p>
              </div>
            )}

            {tutor.education && (
              <div>
                <h4 className="mb-1 text-sm font-medium text-gray-700">Education</h4>
                <p className="text-gray-600">{tutor.education}</p>
              </div>
            )}

            {tutor.experience && (
              <div>
                <h4 className="mb-1 text-sm font-medium text-gray-700">Experience</h4>
                <p className="text-gray-600">{tutor.experience}</p>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={onClose}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-white"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
