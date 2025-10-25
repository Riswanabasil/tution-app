import { AssignmentRepository } from '../../../repositories/assignment/implementation/AssignmentRepository';

import type { IAssignment } from '../../../models/assignment/AssignmentModel';

import mongoose from 'mongoose';
import { CourseRepository } from '../../../repositories/course/implementation/CourseRepository';
import { IAssignmentService } from '../IAssignmentService';
import { IAssignmentRepository } from '../../../repositories/assignment/IAssgnmentRepository';
import { ITopicRepository } from '../../../repositories/topic/ITopicRepository';
import { IModuleRepository } from '../../../repositories/module/IModuleRepository';

export class AssignmentService implements IAssignmentService {
  constructor(
    private assignmentRepo: IAssignmentRepository,
    private topicRepo: ITopicRepository,
    private moduleRepo: IModuleRepository,
    private courseRepo: CourseRepository,
  ) {}

  async createAssignment(topicId: string, data: Partial<IAssignment>): Promise<IAssignment> {
    const topic = await this.topicRepo.findById(topicId);
    if (!topic) throw new Error('Topic not found');

    const moduleId = new mongoose.Types.ObjectId(topic.moduleId);
    const module = await this.moduleRepo.findById(moduleId);
    const courseId = module?.courseId;
    const course = await this.courseRepo.findById(courseId);

    const assignmentData = {
      ...data,
      topicId,
      courseId,
      createdBy: course?.tutor,
    };

    return this.assignmentRepo.create(assignmentData);
  }

  async getAssignmentsByTopic(topicId: string): Promise<IAssignment[]> {
    return this.assignmentRepo.findByTopic(topicId);
  }

  async getAssignmentById(id: string): Promise<IAssignment | null> {
    return this.assignmentRepo.findById(id);
  }

  async updateAssignment(id: string, data: Partial<IAssignment>): Promise<IAssignment | null> {
    return this.assignmentRepo.update(id, data);
  }

  async deleteAssignment(id: string): Promise<void> {
    return this.assignmentRepo.softDelete(id);
  }
}
