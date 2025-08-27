import { getAxios } from '../../../api/Axios';
const axios = getAxios('student');
import type { CourseDetails, ICourse, Module } from '../../../types/course';
import type { Note } from '../../../types/note';

export interface PaginatedCourses {
  courses: ICourse[];
  currentPage: number;
  totalPages: number;
}

export interface MyCourseDTO {
  enrollmentId: string;
  course: CourseDetails;
  enrolledAt: string;
}
export type StudentVideoItem = {
  _id: string;
  title: string;
  description?: string;
  durationSec: number;
  url: string;
  createdAt: string;
  progress: {
    lastPositionSec: number;
    totalWatchedSec: number;
    percent: number;
    completed: boolean;
  };
};

export const getApprovedCourses = async (
  page = 1,
  limit = 10,
  search = '',
  semester?: number,
  sortBy?: string,
): Promise<PaginatedCourses> => {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('limit', String(limit));
  params.append('search', search);

  if (semester !== undefined) params.append('semester', String(semester));
  if (sortBy) params.append('sortBy', sortBy);

  const res = await axios.get<PaginatedCourses>(`/student/courses?${params.toString()}`);
  return res.data;
};

export const fetchCourseDetails = async (id: string): Promise<CourseDetails> => {
  const res = await axios.get<CourseDetails>(`/student/courses/${id}`);
  return res.data;
};

export const getMyCourses = async (): Promise<MyCourseDTO[]> => {
  const res = await axios.get<{ data: MyCourseDTO[] }>('/student/mycourses');
  return res.data.data;
};

export const fetchModulesByCourseId = async (courseId: string): Promise<Module[]> => {
  const res = await axios.get(`/student/modules/${courseId}`);
  console.log(res);

  return res.data;
};

export const fetchTopicsByModuleId = async (moduleId: string, search = '', page = 1, limit = 5) => {
  const res = await axios.get(`/student/topics/${moduleId}`, {
    params: { search, page, limit },
  });
  return res.data;
};

export const fetchNotesByTopicId = async (topicId: string): Promise<Note[]> => {
  const res = await axios.get(`/student/notes/${topicId}`);
  return res.data;
};

export const fetchStudentAssignments = async (topicId: string) => {
  const response = await axios.get(`/student/assignments/${topicId}`);
  console.log(response.data);
  return response.data;
};
export const getSubmissionUploadUrl = async (fileName: string, contentType: string) => {
  const res = await axios.get('/student/submissions/presigned-url', {
    params: { fileName, contentType },
  });
  return res.data;
};
export const submitAssignmentResponse = async (
  assignmentId: string,
  payload: { response: string },
) => {
  console.log(assignmentId);

  const res = await axios.post(`/student/submissions/${assignmentId}`, payload);
  return res.data;
};

export const fetchSubmissionByAssignment = async (assignmentId: string) => {
  const response = await axios.get(`/student/submissions/${assignmentId}`);
  return response.data;
};

export const updateAssignmentResponse = async (
  assignmentId: string,
  payload: { response: string },
) => {
  const res = await axios.put(`/student/submission/${assignmentId}`, payload);
  return res.data;
};

// export const getSubmissionDetails = async (assignmentId: string) => {
//   const res = await axios.get(`/student/submission/${assignmentId}`);
//   return res.data;
// };

//videos

export async function listStudentVideosByTopic(topicId: string) {
  const { data } = await axios.get<StudentVideoItem[]>(`/student/topics/${topicId}/videos`);
  return data;
}

export async function upsertVideoProgress(
  videoId: string,
  payload: {
    ranges: { startSec: number; endSec: number }[];
    lastPositionSec: number;
    durationSec?: number;
  },
) {
  const { data } = await axios.post(`/student/videos/${videoId}/progress`, payload);
  return data as {
    videoId: string;
    lastPositionSec: number;
    totalWatchedSec: number;
    percent: number;
    completed: boolean;
    updatedAt: string;
  };
}
