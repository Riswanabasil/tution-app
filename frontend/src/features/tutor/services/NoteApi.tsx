import axios from '../../../api/TutorAxios';
import type { IAssignment } from '../../../types/assignment';
type Assignment = {
  _id: string;
  title: string;
  dueDate: string;
  description: string;
  createdAt: string;
};
//note
export const getNoteUploadUrls = (count: number) => axios.post("/tutor/note/upload-urls", { count });

export const createNote = (topicId: string, payload: { pdfKeys: string[] }) =>
  axios.post(`/tutor/topic/${topicId}/notes`, payload);

export const fetchNotesByTopic = (topicId: string) =>
  axios.get(`/tutor/topic/${topicId}/notes`).then(res => res.data);

export const updateNote = (noteId: string, payload: { pdfKeys: string[] }) =>
  axios.patch(`/tutor/notes/${noteId}`, payload);

export const deleteNote = (noteId: string) =>
  axios.delete(`/tutor/notes/${noteId}`);

//assignment

export const fetchAssignmentsByTopic = async (topicId: string): Promise<Assignment[]> => {
  const res = await axios.get<{data: Assignment[]}>(`/tutor/${topicId}/assgn`);
  return res.data.data
};
export const createAssignment = (topicId: string, data: IAssignment) =>
  axios.post(`/tutor/${topicId}/assgn`, data);

export const updateAssignment = (id: string, data:Partial< IAssignment>) =>
  axios.patch(`/tutor/assgn/${id}`, data);

export const deleteAssignment = (id: string) =>
  axios.delete(`/tutor/assgn/${id}`);