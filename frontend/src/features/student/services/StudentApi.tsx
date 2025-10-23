import { getAxios } from '../../../api/Axios';
const axios = getAxios('student');

export interface ProfileDTO {
  name: string;
  email: string;
  phone?: string;
  profilePic: string;
  createdAt: string;
}

export interface StatsDTO {
  totalEnrolled: number;
}

export interface PaymentHistoryDTO {
  enrollmentId: string;
  courseId: string;
  title: string;
  thumbnail: string;
  amount: number;
  paidAt: string;
  status: string;
}

export interface UploadUrlDTO {
  uploadUrl: string;
  key: string;
}

export const registerStudent = async (data: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) => {
  const response = await axios.post('/student/register', data);
  return response.data;
};

export const studentLogin = async (data: { email: string; password: string }) => {
  const response = await axios.post('/student/login', data);
  return response.data;
};
export const logoutStudent = async () => {
  await axios.post('/student/logout');
};
export const studentGoogleLogin = async (idToken: string) => {
  const response = await axios.post('/student/google-login', { idToken });

  return response.data;
};

//profile

export const getProfile = async (): Promise<ProfileDTO> => {
  const res = await axios.get<{ data: ProfileDTO }>('/student/profile');
  console.log(res);

  return res.data.data;
};

export const updateProfile = async (payload: {
  name?:string
  phone?: string;
  profilePic?: string;
}): Promise<ProfileDTO> => {
  const res = await axios.put<{ data: ProfileDTO }>('/student/profile', payload);
  return res.data.data;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<void> => {
  await axios.put('/student/profile/password', {
    currentPassword,
    newPassword,
  });
};

export const getStats = async (): Promise<StatsDTO> => {
  const res = await axios.get<{ data: StatsDTO }>('/student/stats');
  return res.data.data;
};

export const getPaymentHistory = async (): Promise<PaymentHistoryDTO[]> => {
  const res = await axios.get<{ data: PaymentHistoryDTO[] }>('/student/history');
  console.log(res);

  return res.data.data;
};

export const getAvatarUploadUrl = async (
  filename: string,
  contentType: string,
): Promise<UploadUrlDTO> => {
  const res = await axios.get<{ uploadUrl: string; key: string }>(`/student/profile/upload-url`, {
    params: { filename, contentType },
  });
  return res.data;
};

//forgot password

export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  const { data } = await axios.post('/student/forgot-password', { email });
  return data;
}

export async function verifyResetOtp(email: string, otp: string): Promise<{ message: string }> {
  const { data } = await axios.post('/student/verify-reset-otp', { email, otp });
  return data;
}

export async function resetPasswordWithOtp(params: {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<{ message: string }> {
  const { data } = await axios.post('/student/reset-password', params);
  return data;
}
