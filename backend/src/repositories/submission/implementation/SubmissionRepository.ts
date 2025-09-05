import mongoose from 'mongoose';
import { ISubmission, SubmissionModel } from '../../../models/submission/SubmissionSchema';
import { ISubmissionRepository } from '../ISubmissionRepository';

export class SubmissionRepository implements ISubmissionRepository {
  async findByStudentAndAssignments(studentId: string, assignmentIds: string[]) {
    return SubmissionModel.find({
      studentId,
      assignmentId: { $in: assignmentIds },
      isDeleted: false,
    });
  }

  async create(data: Partial<ISubmission>) {
    const submission = new SubmissionModel(data);
    return await submission.save();
  }

  async findById(id: string): Promise<ISubmission | null> {
    return SubmissionModel.findById(id);
  }

  async findByAssignmentAndStudent(assignmentId: string, studentId: string) {
    return await SubmissionModel.findOne({
      assignmentId,
      studentId,
      isDeleted: false,
    });
  }

  async updateSubmissionByAssignmentAndStudent(
    assignmentId: string,
    studentId: string,
    response: string,
    submittedFile: string,
  ) {
    return await SubmissionModel.findOneAndUpdate(
      {
        assignmentId: new mongoose.Types.ObjectId(assignmentId),
        studentId: new mongoose.Types.ObjectId(studentId),
      },
      {
        response,
        submittedFile,
        status: 'pending',
      },
      { new: true },
    );
  }
}
