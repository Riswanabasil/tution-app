
import {SubmissionModel} from '../../models/submission/SubmissionSchema';

export class SubmissionRepository {
  async findByStudentAndAssignments(studentId: string, assignmentIds: string[]) {
    return SubmissionModel.find({
      studentId,
      assignmentId: { $in: assignmentIds },
      isDeleted: false
    });
  }
}
