// import useVideoProgress from "../../../../hooks/useVideoProgress";

// export default function VideoPlayerWithProgress({
//   videoId, src, durationSecFromDb, resumeAt
// }: {
//   videoId: string; src: string; durationSecFromDb?: number; resumeAt?: number;
// }) {
//   const { videoRef } = useVideoProgress({ videoId, resumeAt, durationSecFromDb });
//   return <video ref={videoRef} className="w-full rounded-lg bg-black" src={src} controls preload="metadata" />;
// }
import { X } from "lucide-react"; // nice icon library
import useVideoProgress from "../../../../hooks/useVideoProgress";

export default function VideoPlayerWithProgress({
  videoId,
  src,
  durationSecFromDb,
  resumeAt,
  onClose, // allow parent to control closing
}: {
  videoId: string;
  src: string;
  durationSecFromDb?: number;
  resumeAt?: number;
  onClose?: () => void;
}) {
  const { videoRef } = useVideoProgress({ videoId, resumeAt, durationSecFromDb });

  return (
    <div className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header with close */}
      <div className="absolute top-0 left-0 right-0 flex justify-end items-center p-2 bg-gradient-to-b from-black/60 to-transparent z-10">
        {onClose && (
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Video player */}
      <video
        ref={videoRef}
        className="w-full aspect-video rounded-2xl bg-black"
        src={src}
        controls
        preload="metadata"
      />
    </div>
  );
}
