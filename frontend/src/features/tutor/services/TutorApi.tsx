import axios from "../../../api/TutorAxios";
import type { ICourse } from "../../../types/course";
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
}

export const registerTutor = async (data: TutorSignupData) => {
  const res = await axios.post("/tutor/register", data);
  return res.data;
};

export const submitTutorVerification = async (payload: TutorVerificationPayload) => {
  const formData = new FormData();
  formData.append("tutorId", payload.tutorId);
  formData.append("summary", payload.summary);
  formData.append("education", payload.education);
  formData.append("experience", payload.experience);
  formData.append("idProof", payload.idProof);
  formData.append("resume", payload.resume);

  const response = await axios.post("/tutor/submit-verification", formData);
  return response.data;
};

export const loginTutor = async (data: LoginPayload) => {
  const res = await axios.post("/tutor/login", data);
  
  return res.data;
};

// export const getAssignedCourses = async (): Promise<ICourse[]> => {
//   const response = await axios.get("/tutor/dashboard/courses");
//   return response.data.courses;
// };

export const getCourses = async (
  page = 1,
  limit = 10,
  search = ""
): Promise<PaginatedCourses> => {
  const res = await axios.get<PaginatedCourses>(
    `/tutor/courses?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
  );
  return res.data;
};

export const getCourseById = async (id: string): Promise<ICourse> => {
  const res = await axios.get<ICourse>(`/tutor/course/${id}`);
  return res.data;
};

// get presigned S3 URL + key
export const getUploadUrl = async (
  filename: string,
  contentType: string
): Promise<{ uploadUrl: string; key: string }> => {
  const res = await axios.get<{ uploadUrl: string; key: string }>(
    `/tutor/courses/upload-url`,
    { params: { filename, contentType } }
  );
  return res.data;
};

// create new course
export const createCourse = async (payload: CoursePayload): Promise<ICourse> => {
  const res = await axios.post<ICourse>('/tutor/course', payload);
  return res.data;
};

// update existing course
export const updateCourse = async (
  id: string,
  payload: CoursePayload
): Promise<ICourse> => {
  const res = await axios.put<ICourse>(`/tutor/course/${id}`, payload);
  return res.data;
};

// export const getCourseById = async (id: string): Promise<ICourse> => {
//   const res = await axios.get<ICourse>(`/tutor/course/${id}`);
//   return res.data;
// };

// export const createCourse = async (
//   data: {
//     title: string;
//     code: string;
//     semester: number;
//     price: number;
//     offer?: number;
//     actualPrice?: number;
//     details?: string;
//     thumbnail?: File;
//   }
// ): Promise<ICourse> => {
//   const form = new FormData();
//   form.append("title", data.title);
//   form.append("code", data.code);
//   form.append("semester", data.semester.toString());
//   form.append("price", data.price.toString());
//   if (data.offer !== undefined) form.append("offer", data.offer.toString());
//   if (data.actualPrice !== undefined) form.append("actualPrice", data.actualPrice.toString());
//   if (data.details) form.append("details", data.details);
//   if (data.thumbnail) form.append("thumbnail", data.thumbnail);

//   const res = await axios.post<ICourse>(
//     "/tutor/course",
//     form,
//     { headers: { "Content-Type": "multipart/form-data" } }
//   );
//   return res.data;
// };

// export const updateCourse = async (
//   id: string,
//   data: Partial<{
//     title: string;
//     code: string;
//     semester: number;
//     price: number;
//     offer: number;
//     actualPrice: number;
//     details: string;
//     thumbnail: File;
//   }>
// ): Promise<ICourse> => {
//   const form = new FormData();
//   if (data.title) form.append("title", data.title);
//   if (data.code) form.append("code", data.code);
//   if (data.semester !== undefined) form.append("semester", data.semester.toString());
//   if (data.price !== undefined) form.append("price", data.price.toString());
//   if (data.offer !== undefined) form.append("offer", data.offer.toString());
//   if (data.actualPrice !== undefined) form.append("actualPrice", data.actualPrice.toString());
//   if (data.details) form.append("details", data.details);
//   if (data.thumbnail) form.append("thumbnail", data.thumbnail);

//   const res = await axios.put<ICourse>(
//     `/tutor/course/${id}`,
//     form,
//     { headers: { "Content-Type": "multipart/form-data" } }
//   );
//   return res.data;
// };

export const deleteCourse = async (id: string): Promise<void> => {
  await axios.delete(`/tutor/course/${id}`);
};
