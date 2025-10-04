
import { getAxios } from '../../../api/Axios';
const axios = getAxios('tutor');
export type LiveSessionDTO = {
  _id: string;
  title: string;
  description?: string;
  topicId: string;
  courseId: string;
  createdBy: string;
  scheduledAt?: string;                 // ISO string
  status: 'scheduled' | 'live' | 'ended';
  roomCode: string;
  createdAt: string;
  updatedAt: string;
};

// LIST by topic (optionally filter by status)
export async function fetchLiveSessionsByTopic(
  topicId: string,
  status?: LiveSessionDTO['status']
): Promise<LiveSessionDTO[]> {
  const { data } = await axios.get(`/tutor/${topicId}/livesession`, {
    params: status ? { status } : undefined,
  });
  return data;
}

// CREATE under a topic
export async function createLiveSession(
  topicId: string,
  payload: { title: string; description?: string; scheduledAt?: string }
): Promise<LiveSessionDTO> {
  const { data } = await axios.post(`/tutor/${topicId}/livesession`, payload);
  return data;
}

// GET by id
export async function getLiveSession(sessionId: string): Promise<LiveSessionDTO> {
  const { data } = await axios.get(`/tutor/livesession/${sessionId}`);
  return data;
}

// UPDATE details (title/description/scheduledAt)
export async function updateLiveSession(
  sessionId: string,
  payload: { title?: string; description?: string; scheduledAt?: string }
): Promise<LiveSessionDTO> {
  const { data } = await axios.patch(`/tutor/livesession/${sessionId}`, payload);
  return data;
}

// UPDATE status (scheduled/live/ended)
export async function updateLiveSessionStatus(
  sessionId: string,
  status: LiveSessionDTO['status']
): Promise<LiveSessionDTO> {
  const { data } = await axios.patch(`/tutor/livesession/${sessionId}/status`, { status });
  return data;
}

// DELETE (soft-delete on backend, per our earlier design)
export async function deleteLiveSession(sessionId: string): Promise<void> {
  await axios.delete(`/tutor/livesession/${sessionId}`);
}