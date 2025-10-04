import { Types } from 'mongoose';
import { ILiveSession } from '../../models/liveSession/liveSessionSchema';

export interface ILiveSessionRepository {
  create(data: Partial<ILiveSession>): Promise<ILiveSession>;
  findByTopic(topicId: string, opts?: { status?: ILiveSession['status'] }): Promise<ILiveSession[]>;
  findById(id: string | Types.ObjectId): Promise<ILiveSession | null>;
  updateStatus(id: string, status: ILiveSession['status']): Promise<ILiveSession | null>;
  softDelete(id: string): Promise<void>;
}
