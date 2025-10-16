import { getAxios } from '../../../api/Axios';
const axios = getAxios('tutor');
import type { ICourse } from '../../../types/course';
interface LoginPayload {
  email: string;
  password: string;
}

interface TutorVerificationPayload {
  tutorId: string;
  summary: string;
  education: string;
  experience: string;
  idProof: File;
  resume: File;
}

interface TutorSignupData {
  name: string;
  phone: string;
  email: string;
  password: string;
}

interface PaginatedCourses {
  courses: ICourse[];
  currentPage: number;
  totalPages: number;
}

export interface CoursePayload {
  title: string;
  code: string;
  semester: number;
  price: number;
  offer?: number;
  actualPrice?: number;
  details?: string;
  imageKey?: string;
  demoKey?: string;
}
type TutorLoginResp = {
  message: string;
  accessToken: string;
  tutor: {
    id: string;
    name: string;
    email: string;
    status: 'pending' | 'verification-submitted' | 'approved' | 'rejected';
  };
};
export const registerTutor = async (data: TutorSignupData) => {
  const res = await axios.post('/tutor/register', data);
  return res.data;
};



export const submitTutorVerification = async (payload: TutorVerificationPayload) => {
  // 1) Ask backend for presigned PUT URLs
  const { data: presigned } = await axios.post('/tutor/verification/upload-urls', {
    idFilename: payload.idProof.name,
    idContentType: payload.idProof.type || 'application/octet-stream',
    resumeFilename: payload.resume.name,
    resumeContentType: payload.resume.type || 'application/octet-stream',
  });

  // 2) Upload both files directly to S3
  await Promise.all([
    fetch(presigned.idProof.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': payload.idProof.type || 'application/octet-stream' },
      body: payload.idProof,
    }),
    fetch(presigned.resume.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': payload.resume.type || 'application/octet-stream' },
      body: payload.resume,
    }),
  ]);

  // 3) Send only KEYS to the submit endpoint
  const response = await axios.post('/tutor/submit-verification', {
    tutorId: payload.tutorId,
    summary: payload.summary,
    education: payload.education,
    experience: payload.experience,
    idProofKey: presigned.idProof.key,
    resumeKey: presigned.resume.key,
  });

  return response.data;
};

export const loginTutor = async (data: LoginPayload) => {
  const res = await axios.post('/tutor/login', data);

  return res.data;
};

export const tutorGoogleLogin = async (idToken: string): Promise<TutorLoginResp> => {
  const api = getAxios('tutor'); 
  const { data } = await api.post('/tutor/google-login', { idToken });
  return data;
};
export const logoutTutor = async () => {
  await axios.post('/tutor/logout');
};
export const getCourses = async (page = 1, limit = 10, search = ''): Promise<PaginatedCourses> => {
  const res = await axios.get<PaginatedCourses>(
    `/tutor/courses?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
  );
  return res.data;
};

export const getCourseById = async (id: string): Promise<ICourse> => {
  const res = await axios.get<ICourse>(`/tutor/course/${id}`);
  return res.data;
};

// presigned S3 URL + key
export const getUploadUrl = async (
  filename: string,
  contentType: string,
): Promise<{ uploadUrl: string; key: string }> => {
  const res = await axios.get<{ uploadUrl: string; key: string }>(`/tutor/courses/upload-url`, {
    params: { filename, contentType },
  });
  return res.data;
};

export const getDemoUploadUrl = async (
  filename: string,
  contentType: string,
): Promise<{ uploadUrl: string; key: string }> => {
  const res = await axios.get<{ uploadUrl: string; key: string }>(
    `/tutor/courses/demo-upload-url`,
    { params: { filename, contentType } },
  );
  return res.data;
};

// create new course
export const createCourse = async (payload: CoursePayload): Promise<ICourse> => {
  const res = await axios.post<ICourse>('/tutor/course', payload);
  return res.data;
};

// update course
export const updateCourse = async (id: string, payload: CoursePayload): Promise<ICourse> => {
  const res = await axios.put<ICourse>(`/tutor/course/${id}`, payload);
  return res.data;
};

export async function reapplyCourse(courseId: string): Promise<ICourse> {
  const res = await axios.patch(`/tutor/courses/${courseId}/reapply`);
  return res.data;
}

export const deleteCourse = async (id: string): Promise<void> => {
  await axios.delete(`/tutor/course/${id}`);
};

//profile

export interface VerificationDetails {
  summary: string;
  education: string;
  experience: string;
  idProof: string;
  resume: string;
}

export interface TutorProfileDTO {
  name: string;
  email: string;
  phone?: string;
  profilePic: string;
  createdAt: string;
  verificationDetails?: VerificationDetails;
  walletBalance: number;
}

export interface TutorStatsDTO {
  courseCount: number;
  studentCount: number;
}

export interface TutorCourseDTO {
  _id: string;
  title: string;
  status: string;
  studentCount: number;
}

export const getTutorProfile = () =>
  axios.get<{ data: TutorProfileDTO }>('/tutor/profile').then((r) => r.data.data);

export const updateTutorProfile = (payload: Partial<TutorProfileDTO>) =>
  axios.put<{ data: TutorProfileDTO }>('/tutor/profile', payload).then((r) => r.data.data);

export const changeTutorPassword = (current: string, next: string) =>
  axios.put('/tutor/profile/password', {
    currentPassword: current,
    newPassword: next,
  });

export const getTutorStats = () =>
  axios.get<{ data: TutorStatsDTO }>('/tutor/profile/stats').then((r) => r.data.data);

export const getTutorCourses = () =>
  axios.get<{ data: TutorCourseDTO[] }>('/tutor/profile/courses').then((r) => r.data.data);

export const getAvatarUploadUrl = async (
  filename: string,
  contentType: string,
): Promise<{ uploadUrl: string; key: string }> => {
  const res = await axios.get<{ uploadUrl: string; key: string }>(`/tutor/profile/upload-url`, {
    params: { filename, contentType },
  });
  return res.data;
};
