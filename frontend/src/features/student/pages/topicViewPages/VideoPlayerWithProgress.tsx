
import { X } from 'lucide-react';
import useVideoProgress from '../../../../hooks/useVideoProgress';

export default function VideoPlayerWithProgress({
  videoId,
  src,
  durationSecFromDb,
  resumeAt,
  onClose,
}: {
  videoId: string;
  src: string;
  durationSecFromDb?: number;
  resumeAt?: number;
  onClose?: () => void;
}) {
  const { videoRef } = useVideoProgress({ videoId, resumeAt, durationSecFromDb });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl">
      {/* Header with close */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-end bg-gradient-to-b from-black/60 to-transparent p-2">
        {onClose && (
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Video player */}
      <video
        ref={videoRef}
        className="aspect-video w-full rounded-2xl bg-black"
        src={src}
        controls
        preload="metadata"
      />
    </div>
  );
}
