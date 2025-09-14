import { useEffect, useState } from "react";
import { createReview, getMyReview, updateReview, type ReviewDTO } from "../services/ReviewApi";

type Props = {
  courseId: string;
  open: boolean;
  onClose: () => void;
  onSaved?: (review: ReviewDTO) => void; 
};

export default function ReviewModal({ courseId, open, onClose, onSaved }: Props) {
  const [loading, setLoading] = useState(false);
  const [initial, setInitial] = useState<ReviewDTO | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setLoading(true);
    getMyReview(courseId)
      .then((r) => {
        setInitial(r);
        setRating(r?.rating ?? 0);
        setComment(r?.comment ?? "");
      })
      .catch((e) => setError(e?.message || "Failed to load review"))
      .finally(() => setLoading(false));
  }, [courseId, open]);

  async function handleSubmit() {
    try {
      setError(null);
      setLoading(true);
      if (rating < 1 || rating > 5) {
        setError("Rating must be between 1 and 5");
        setLoading(false);
        return;
      }
      let saved: ReviewDTO;
      if (initial?._id) {
        saved = await updateReview(initial._id, { rating, comment });
      } else {
        saved = await createReview({ courseId, rating, comment });
      }
      onSaved?.(saved);
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to save review");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {initial ? "Edit your review" : "Rate & Review"}
          </h3>
          <p className="text-sm text-gray-500">Course ID: {courseId}</p>
        </div>

        {/* Rating */}
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-gray-700">Your Rating</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={`h-10 w-10 rounded-full border text-sm font-semibold ${
                  n <= rating ? "bg-yellow-400/90 border-yellow-400" : "bg-gray-100 border-gray-300"
                }`}
                aria-label={`Rate ${n}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">Comment (optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
            placeholder="What did you like or dislike?"
          />
        </div>

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2 font-semibold text-white hover:from-blue-700 hover:to-purple-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Saving..." : initial ? "Update Review" : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
}
