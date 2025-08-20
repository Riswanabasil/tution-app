import { useCallback, useEffect, useState } from "react";
import { listStudentVideosByTopic, type StudentVideoItem } from "../features/student/services/CourseApi";

export default function useStudentVideos(topicId: string) {
  const [data, setData] = useState<StudentVideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listStudentVideosByTopic(topicId);
      setData(res);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  useEffect(() => { if (topicId) reload(); }, [topicId, reload]);

  return { videos: data, loading, error, reload };
}
