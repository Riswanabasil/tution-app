import { getAxios } from '../../../api/Axios';
const axios = getAxios('tutor');
import type { Module } from '../../../types/module';
import type { Topic, TopicForm } from '../../../types/topic';

// Modules
export const fetchModules = async (courseId: string): Promise<Module[]> => {
  const res = await axios.get<Module[]>(`/tutor/courses/${courseId}/modules`);
  console.log(res.data);
  return res.data;
};

export const fetchModuleById = async (courseId: string, moduleId: string): Promise<Module> => {
  const res = await axios.get<Module>(`/tutor/courses/${courseId}/modules/${moduleId}`);
  return res.data;
};
export const createModule = async (
  courseId: string,
  name: string,
  order: number,
): Promise<Module> => {
  const res = await axios.post<Module>(`/tutor/courses/${courseId}/modules`, { name, order });
  return res.data;
};
export const updateModule = async (
  courseId: string,
  moduleId: string,
  data: Partial<Module>,
): Promise<Module> => {
  const res = await axios.put<Module>(`/tutor/courses/${courseId}/modules/${moduleId}`, data);
  return res.data;
};
export const deleteModule = async (courseId: string, moduleId: string): Promise<void> => {
  await axios.delete(`/tutor/courses/${courseId}/modules/${moduleId}`);
};

// Topics
export const fetchTopics = async (moduleId: string): Promise<Topic[]> => {
  const res = await axios.get<{ topics: Topic[] }>(
    `/tutor/modules/${moduleId}/topics?page=1&limit=20`,
  );
  console.log(res);

  return res.data.topics;
};

export async function createTopic(moduleId: string, payload: TopicForm): Promise<Topic> {
  const res = await axios.post(`/tutor/modules/${moduleId}/topics`, payload);
  return res.data;
}

export async function getTopicById(id: string): Promise<Topic> {
  const res = await axios.get(`/tutor/topics/${id}`);
  return res.data;
}

export async function updateTopic(id: string, payload: TopicForm): Promise<Topic> {
  const res = await axios.patch(`/tutor/topics/${id}`, payload);
  return res.data;
}

export async function deleteTopic(id: string): Promise<void> {
  await axios.delete(`/tutor/topics/${id}`);
}
