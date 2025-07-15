import axios from '../../../api/TutorAxios';
import type { Module } from '../../../types/module';
import type { Topic } from '../../../types/topic';

// Modules
export const fetchModules = async (courseId: string): Promise<Module[]> => {
  const res = await axios.get<Module[]>(`/tutor/courses/${courseId}/modules`);
  console.log(res.data)
  return res.data;
};

export const fetchModuleById = async (
  courseId: string,
  moduleId: string
): Promise<Module> => {
  const res = await axios.get<Module>(`/tutor/courses/${courseId}/modules/${moduleId}`)
  return res.data
}
export const createModule = async (courseId: string, name: string, order: number): Promise<Module> => {
  const res = await axios.post<Module>(`/tutor/courses/${courseId}/modules`, { name, order });
  return res.data;
};
export const updateModule = async (courseId: string, moduleId: string, data: Partial<Module>): Promise<Module> => {
  const res = await axios.put<Module>(`/tutor/courses/${courseId}/modules/${moduleId}`, data);
  return res.data;
};
export const deleteModule = async (courseId: string, moduleId: string): Promise<void> => {
  await axios.delete(`/tutor/courses/${courseId}/modules/${moduleId}`);
};

// Topics
export const fetchTopics = async (moduleId: string): Promise<Topic[]> => {
  const res = await axios.get<{ topics: Topic[] }>(`/api/tutor/modules/${moduleId}/topics?page=1&limit=20`);
  return res.data.topics;
};