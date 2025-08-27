import { getAxios } from '../../../api/Axios';
const axios = getAxios('tutor');
import type { IAssignment } from '../../../types/assignment';
type Assignment = {
  _id: string;
  title: string;
  dueDate: string;
  description: string;
  createdAt: string;
};
export type NewVideoPayload = {
  topicId: string;
  title: string;
  description?: string;
  durationSec: number;
  key: string;
  contentType: string;
};

export type VideoItem = {
  _id: string;
  title: string;
  description?: string;
  durationSec: number;
  url: string;
  createdAt: string;
};
//note
export const getNoteUploadUrls = (count: number) =>
  axios.post('/tutor/note/upload-urls', { count });

export const createNote = (topicId: string, payload: { pdfKeys: string[] }) =>
  axios.post(`/tutor/topic/${topicId}/notes`, payload);

export const fetchNotesByTopic = (topicId: string) =>
  axios.get(`/tutor/topic/${topicId}/notes`).then((res) => res.data);

export const updateNote = (noteId: string, payload: { pdfKeys: string[] }) =>
  axios.patch(`/tutor/notes/${noteId}`, payload);

export const deleteNote = (noteId: string) => axios.delete(`/tutor/notes/${noteId}`);

//assignment

export const fetchAssignmentsByTopic = async (topicId: string): Promise<Assignment[]> => {
  const res = await axios.get<{ data: Assignment[] }>(`/tutor/${topicId}/assgn`);
  return res.data.data;
};
export const createAssignment = (topicId: string, data: IAssignment) =>
  axios.post(`/tutor/${topicId}/assgn`, data);

export const updateAssignment = (id: string, data: Partial<IAssignment>) =>
  axios.patch(`/tutor/assgn/${id}`, data);

export const deleteAssignment = (id: string) => axios.delete(`/tutor/assgn/${id}`);

//videos

export async function getVideoUploadUrl(filename: string, contentType: string) {
  const { data } = await axios.get('/tutor/videos/upload-url', {
    params: { filename, contentType },
  });
  return data as { uploadUrl: string; key: string };
}

export async function createVideo(payload: NewVideoPayload) {
  const { data } = await axios.post('/tutor/videos', payload);
  return data as VideoItem;
}

export async function listVideosByTopic(topicId: string) {
  const { data } = await axios.get(`/tutor/videos/topic/${topicId}`);
  return data as VideoItem[];
}

export async function updateVideo(
  id: string,
  patch: Partial<Pick<NewVideoPayload, 'title' | 'description' | 'durationSec'>>,
) {
  const { data } = await axios.patch(`/tutor/videos/${id}`, patch);
  return data as VideoItem;
}

export async function deleteVideo(id: string) {
  await axios.delete(`/tutor/videos/${id}`);
}
