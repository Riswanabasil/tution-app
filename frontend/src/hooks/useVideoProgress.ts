import { useCallback, useEffect, useRef, useState } from 'react';
import { upsertVideoProgress } from '../features/student/services/CourseApi';

type Range = { startSec: number; endSec: number };

function mergeRanges(ranges: Range[]): Range[] {
  const sorted = ranges
    .filter((r) => r.endSec > r.startSec)
    .sort((a, b) => a.startSec - b.startSec);
  const out: Range[] = [];
  for (const r of sorted) {
    if (!out.length) {
      out.push({ ...r });
      continue;
    }
    const last = out[out.length - 1];
    if (r.startSec <= last.endSec + 0.01) last.endSec = Math.max(last.endSec, r.endSec);
    else out.push({ ...r });
  }
  return out;
}

export default function useVideoProgress({
  videoId,
  resumeAt = 0,
  durationSecFromDb,
  syncEveryMs = 10_000,
}: {
  videoId: string;
  resumeAt?: number;
  durationSecFromDb?: number;
  syncEveryMs?: number;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ranges, setRanges] = useState<Range[]>([]);
  const lastTickRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const ref = useCallback(
    (node: HTMLVideoElement | null) => {
      if (!node) return;
      videoRef.current = node;
      if (resumeAt && resumeAt > 0) {
        try {
          node.currentTime = resumeAt;
        } catch {}
      }

      const onPlay = () => {
        lastTickRef.current = node.currentTime;
      };
      const onTimeUpdate = () => {
        const last = lastTickRef.current;
        const now = node.currentTime;
        if (last == null) {
          lastTickRef.current = now;
          return;
        }
        if (now > last) {
          setRanges((prev) => mergeRanges([...prev, { startSec: last, endSec: now }]));
          lastTickRef.current = now;
        } else {
          lastTickRef.current = now;
        }
      };
      const onPauseOrEnded = () => {
        const last = lastTickRef.current;
        const now = node.currentTime;
        if (last != null && now > last) {
          setRanges((prev) => mergeRanges([...prev, { startSec: last, endSec: now }]));
        }
        lastTickRef.current = null;
      };

      node.addEventListener('play', onPlay);
      node.addEventListener('timeupdate', onTimeUpdate);
      node.addEventListener('pause', onPauseOrEnded);
      node.addEventListener('ended', onPauseOrEnded);

      return () => {
        node.removeEventListener('play', onPlay);
        node.removeEventListener('timeupdate', onTimeUpdate);
        node.removeEventListener('pause', onPauseOrEnded);
        node.removeEventListener('ended', onPauseOrEnded);
      };
    },
    [resumeAt],
  );

  useEffect(() => {
    const send = async () => {
      const v = videoRef.current;
      if (!v || ranges.length === 0) return;
      try {
        await upsertVideoProgress(videoId, {
          ranges,
          lastPositionSec: Math.floor(v.currentTime),
          durationSec: durationSecFromDb || Math.floor(v.duration || 0) || undefined,
        });
      } catch {}
    };

    const id = window.setInterval(send, syncEveryMs);
    timerRef.current = id;
    const onVisibility = () => {
      if (document.hidden) send();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibility);
      send();
    };
  }, [ranges, videoId, durationSecFromDb, syncEveryMs]);

  return { videoRef: ref };
}
