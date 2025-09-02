import { AssignmentRepository } from '../../../repositories/assignment/implementation/AssignmentRepository';

import type { IAssignment } from '../../../models/assignment/AssignmentModel';

import { TopicRepository } from '../../../repositories/topic/implementation/TopicRepository';
import { ModuleRepository } from '../../../repositories/module/implementation/ModuleRepository';
import mongoose from 'mongoose';
import { CourseRepository } from '../../../repositories/course/implementation/CourseRepository';
import { IAssignmentService } from '../IAssignmentService';

export class AssignmentService implements IAssignmentService {
  constructor(
    private assignmentRepo: AssignmentRepository,
    private topicRepo: TopicRepository,
    private moduleRepo: ModuleRepository,
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
