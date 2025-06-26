// src/services/admin/courseService.ts

import { ICourse } from '../../models/CourseSchema';
import { CourseRepository } from '../../repositories/admin/CourseRepository';

const courseRepo = new CourseRepository();

export const courseService = {
  createCourse: async (data: Partial<ICourse>) => {
    return await courseRepo.create(data);
  },

  getAllCourses: async (page: number, limit: number, search: string) => {
    return await courseRepo.getPaginatedCourses(page, limit, search);
  },

  getCourseById: async (id: string) => {
    return await courseRepo.findById(id);
  },

  updateCourse: async (id: string, data: Partial<ICourse>) => {
    return await courseRepo.update(id, data);
  },

  deleteCourse: async (id: string) => {
    return await courseRepo.delete(id);
  }
};
