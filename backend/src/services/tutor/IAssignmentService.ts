import { IAssignment } from '../../models/assignment/AssignmentModel';

export interface IAssignmentService {
  createAssignment(topicId: string, data: Partial<IAssignment>): Promise<IAssignment>;

  getAssignmentsByTopic(topicId: string): Promise<IAssignment[]>;

  getAssignmentById(id: string): Promise<IAssignment | null>;

  updateAssignment(id: string, data: Partial<IAssignment>): Promise<IAssignment | null>;

  deleteAssignment(id: string): Promise<void>;
}
