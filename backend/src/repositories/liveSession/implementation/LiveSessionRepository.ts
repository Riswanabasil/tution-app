import { Types } from 'mongoose';
import { ILiveSession, LiveSessionModel } from '../../../models/liveSession/liveSessionSchema';
import { ILiveSessionRepository } from '../ILiveSessionRepository';

export class LiveSessionRepository implements ILiveSessionRepository {
  async create(data: Partial<ILiveSession>): Promise<ILiveSession> {
    return LiveSessionModel.create(data);
  }

  async findByTopic(topicId: string, opts?: { status?: ILiveSession['status'] }): Promise<ILiveSession[]> {
    const query: any = { topicId, isDeleted: false };
    if (opts?.status) query.status = opts.status;
    return LiveSessionModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findById(id: string | Types.ObjectId): Promise<ILiveSession | null> {
    return LiveSessionModel.findOne({ _id: id, isDeleted: false }).exec();
  }

  async updateStatus(id: string, status: ILiveSession['status']): Promise<ILiveSession | null> {
    return LiveSessionModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
  }

  async softDelete(id: string): Promise<void> {
    await LiveSessionModel.findByIdAndUpdate(id, { isDeleted: true }).exec();
  }
}
