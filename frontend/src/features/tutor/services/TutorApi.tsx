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

export const getAssignedCourses = async (): Promise<ICourse[]> => {
  const response = await axios.get("/tutor/dashboard/courses");
  return response.data.courses;
};