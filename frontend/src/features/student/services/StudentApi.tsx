import axios from "../../../api/AxiosInstance.tsx";

export const registerStudent = async (data: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) => {
  const response = await axios.post("/student/register", data);
  return response.data;
};

export const studentLogin = async (data: { email: string; password: string }) => {
  const response = await axios.post("/student/login", data);
  return response.data;
};

export const studentGoogleLogin = async (idToken: string) => {
 
  const response = await axios.post("/student/google-login", { idToken })

   return  response.data
};