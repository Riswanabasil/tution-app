import { ISubmission } from '../../models/submission/SubmissionSchema';

export interface ISubmissionRepository {
  findByStudentAndAssignments(studentId: string, assignmentIds: string[]): Promise<ISubmission[]>;

  create(data: Partial<ISubmission>): Promise<ISubmission>;

  findById(id: string): Promise<ISubmission | null>;

  findByAssignmentAndStudent(assignmentId: string, studentId: string): Promise<ISubmission | null>;

  updateSubmissionByAssignmentAndStudent(
    assignmentId: string,
    studentId: string,
    response: string,
    submittedFile: string,
  ): Promise<ISubmission | null>;

  updateFeedbackAndVerify(submissionId: string, feedback: string): Promise<ISubmission | null>;
}
