import { Types } from 'mongoose';
import { ILiveSession } from '../../../models/liveSession/liveSessionSchema';
import { IStudentLiveSessionService, StudentLiveSessionDTO } from '../ILiveSessionService';
import { ILiveSessionRepository } from '../../../repositories/liveSession/ILiveSessionRepository';

export class StudentLiveSessionService implements IStudentLiveSessionService {
  constructor(private liveRepo: ILiveSessionRepository) {}

  async listByTopic(
    topicId: string,
    status?: ILiveSession['status'],
  ): Promise<StudentLiveSessionDTO[]> {
    const sessions = await this.liveRepo.findByTopic(topicId, { status });
    return sessions.map(this.toStudentDTO);
  }

  async getById(id: string): Promise<StudentLiveSessionDTO | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const s = await this.liveRepo.findById(id);
    return s ? this.toStudentDTO(s) : null;
  }

  private toStudentDTO(s: ILiveSession): StudentLiveSessionDTO {
    return {
      _id: s._id.toString(),
      title: s.title,
      description: s.description,
      status: s.status,
      scheduledAt: s.scheduledAt,
      createdAt: s.createdAt!,
    };
  }
}
