import { getAxios } from '../../../api/Axios';
const axios = getAxios('student');

export type StudentLiveSessionDTO = {
  _id: string;
  title: string;
  description?: string;
  status: 'scheduled' | 'live' | 'ended';
  scheduledAt?: string;         
  createdAt: string;
};

export const fetchStudentSessionsByTopic = async (
  topicId: string,
  status?: StudentLiveSessionDTO['status']
): Promise<StudentLiveSessionDTO[]> => {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  const url = `/student/topic/${topicId}/livesession${params.toString() ? `?${params.toString()}` : ''}`;

  const { data } = await axios.get<StudentLiveSessionDTO[]>(url);
  return data;
};

export const fetchStudentSessionById = async (
  id: string
): Promise<StudentLiveSessionDTO> => {
  const { data } = await axios.get<StudentLiveSessionDTO>(`/student/livesession/${id}`);
  return data;
};
