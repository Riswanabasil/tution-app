import { ILiveSession } from '../../models/liveSession/liveSessionSchema';

export type StudentLiveSessionDTO = {
  _id: string;
  title: string;
  description?: string;
  status: 'scheduled' | 'live' | 'ended';
  scheduledAt?: Date;
  createdAt: Date;
};

export interface IStudentLiveSessionService {
  listByTopic(topicId: string, status?: ILiveSession['status']): Promise<StudentLiveSessionDTO[]>;
  getById(id: string): Promise<StudentLiveSessionDTO | null>;
}
