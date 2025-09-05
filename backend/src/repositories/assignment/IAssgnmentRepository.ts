import { Types } from 'mongoose';
import { IAssignment } from '../../models/assignment/AssignmentModel';

export interface IAssignmentRepository {
  create(data: Partial<IAssignment>): Promise<IAssignment>;
  findByTopic(topicId: string): Promise<IAssignment[]>;
  findById(id: string | Types.ObjectId): Promise<IAssignment | null>;
  update(id: string, updateData: Partial<IAssignment>): Promise<IAssignment | null>;
  softDelete(id: string): Promise<void>;
}
