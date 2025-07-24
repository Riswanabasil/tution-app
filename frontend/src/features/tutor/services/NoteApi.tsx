import axios from '../../../api/TutorAxios';

export const getNoteUploadUrls = (count: number) => axios.post("/tutor/note/upload-urls", { count });

export const createNote = (topicId: string, payload: { pdfKeys: string[] }) =>
  axios.post(`/tutor/topic/${topicId}/notes`, payload);

export const fetchNotesByTopic = (topicId: string) =>
  axios.get(`/tutor/topic/${topicId}/notes`).then(res => res.data);

export const updateNote = (noteId: string, payload: { pdfKeys: string[] }) =>
  axios.patch(`/tutor/notes/${noteId}`, payload);

export const deleteNote = (noteId: string) =>
  axios.delete(`/tutor/notes/${noteId}`);