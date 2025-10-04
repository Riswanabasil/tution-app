import mongoose from 'mongoose';
import { ITopicRepository } from '../../../repositories/topic/ITopicRepository';
import { IModuleRepository } from '../../../repositories/module/IModuleRepository';
import { ICourseRepository } from '../../../repositories/course/ICourseRepository';
import { ILiveSessionRepository } from '../../../repositories/liveSession/ILiveSessionRepository';
import { ILiveSession } from '../../../models/liveSession/liveSessionSchema';
import { ILiveSessionService } from '../ILiveSessionService';

export class LiveSessionService implements ILiveSessionService {
  constructor(
    private liveRepo: ILiveSessionRepository,
    private topicRepo: ITopicRepository,
    private moduleRepo: IModuleRepository,
    private courseRepo: ICourseRepository
  ) {}

  async createSession(topicId: string, tutorId: string, data: Partial<ILiveSession>): Promise<ILiveSession> {
    const topic = await this.topicRepo.findById(topicId);
    if (!topic) throw new Error('Topic not found');

    const moduleId = new mongoose.Types.ObjectId(topic.moduleId);
    const moduleDoc = await this.moduleRepo.findById(moduleId);
    const courseId = (moduleDoc as any)?.courseId;
    const course = await this.courseRepo.findById(courseId);
    if (!course) throw new Error('Course not found for topic');

    const roomCode = Math.random().toString(36).slice(2, 8).toUpperCase();

    const payload: Partial<ILiveSession> = {
      title: data.title!,
      description: data.description,
      topicId,
      courseId,
      createdBy: tutorId,
      scheduledAt: data.scheduledAt,
      status: 'scheduled',
      roomCode,
    };

    return this.liveRepo.create(payload);
  }

  listByTopic(topicId: string, status?: ILiveSession['status']) {
    return this.liveRepo.findByTopic(topicId, { status });
  }

  getById(id: string) {
    return this.liveRepo.findById(id);
  }

  updateStatus(id: string, status: ILiveSession['status']) {
    return this.liveRepo.updateStatus(id, status);
  }

  delete(id: string) {
    return this.liveRepo.softDelete(id);
  }
}
