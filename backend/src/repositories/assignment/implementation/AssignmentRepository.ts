import { AssignmentModel, IAssignment } from '../../../models/assignment/AssignmentModel';
import { Types } from 'mongoose';
import { IAssignmentRepository } from '../IAssgnmentRepository';

export class AssignmentRepository implements IAssignmentRepository {
  async create(data: Partial<IAssignment>): Promise<IAssignment> {
    return await AssignmentModel.create(data);
  }

  async findByTopic(topicId: string): Promise<IAssignment[]> {
    return AssignmentModel.find({ topicId, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  async findById(id: string | Types.ObjectId): Promise<IAssignment | null> {
    return AssignmentModel.findOne({ _id: id, isDeleted: false }).exec();
  }

  async update(id: string, updateData: Partial<IAssignment>): Promise<IAssignment | null> {
    return AssignmentModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async softDelete(id: string): Promise<void> {
    await AssignmentModel.findByIdAndUpdate(id, { isDeleted: true }).exec();
  }
  
}
