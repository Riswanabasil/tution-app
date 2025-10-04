import { ILiveSession } from '../../models/liveSession/liveSessionSchema';

export interface ILiveSessionService {
  createSession(topicId: string, tutorId: string, data: Partial<ILiveSession>): Promise<ILiveSession>;
  listByTopic(topicId: string, status?: ILiveSession['status']): Promise<ILiveSession[]>;
  getById(id: string): Promise<ILiveSession | null>;
  updateStatus(id: string, status: ILiveSession['status']): Promise<ILiveSession | null>;
  delete(id: string): Promise<void>;
}
