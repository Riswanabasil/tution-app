import adminAxios from "../../../api/AxiosAdmin";
import type { ITutor } from "../../../types/types";

export const loginAdmin=async (email:string,password:string)=>{
  const response= await adminAxios.post('/admin/login', { email, password })
  return response.data
}
export const logoutAdmin = async () => {
  await adminAxios.post("/admin/logout");
};
//Tutor APIs..

export const fetchTutors = async (
  page: number,
  limit: number,
  status?: string,
  search?: string
) => {
  const query = new URLSearchParams();
  query.append("page", page.toString());
  query.append("limit", limit.toString());
  if (status) query.append("status", status);
  if (search) query.append("search", search);
  const response = await adminAxios.get(`/admin/tutors?${query.toString()}`);
  return response.data;
};

export const getTutorById = async (id: string): Promise<ITutor> => {
  const res = await adminAxios.get(`/admin/tutor/${id}`);
  console.log(res);

  return res.data;
};

export const updateTutorStatus = async (
  tutorId: string,
  status: "approved" | "rejected"
) => {
  console.log(tutorId);
  
  const response = await adminAxios.patch(`/admin/tutor/${tutorId}/status`, {
    status,
  });
  console.log(response);

  return response.data;
};

export const assignCoursesToTutor = async (tutorId: string, courseIds: string[]) => {
  const response = await adminAxios.post(`/admin/${tutorId}/assign-courses`, { courseIds });
  return response.data;
};


//Student APIs..
export const fetchStudents = async (
  page: number,
  limit: number,
  search?: string,
  sort?: string,
  order?: "asc" | "desc"
) => {
  const query = new URLSearchParams();
  query.append("page", page.toString());
  query.append("limit", limit.toString());
  if (search) query.append("search", search);
  if (sort) query.append("sort", sort);
  if (order) query.append("order", order);

  const response = await adminAxios.get(`/admin/students?${query.toString()}`);
  return response.data;
};

export const updateStudentBlockStatus = async (
  studentId: string,
  isBlocked: boolean
) => {
  const response = await adminAxios.patch(`/admin/student/${studentId}/block`, {
    isBlocked,
  });
  return response.data;
};

