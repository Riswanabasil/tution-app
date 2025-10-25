import { Types } from 'mongoose';
import { ISubmission } from '../../models/submission/SubmissionSchema';

// export type AssignmentWithStatus = {
//   _id: Types.ObjectId | string;
//   title: string;
//   description?: string;
//   dueDate: Date;
//   status: 'expired' | 'not submitted' | 'pending' | 'verified';
//   submission: {
//     _id: Types.ObjectId | string;
//     submittedFiles?: string;
//     feedback?: string;
//     submittedAt?: Date;
//   } | null;
// };

export type AssignmentWithStatus = {
  _id: Types.ObjectId | string;
  title: string;
  description?: string;
  dueDate: Date;
  status: 'expired' | 'not submitted' | 'pending' | 'verified';
  submission: {
    _id: Types.ObjectId | string;
    submittedFiles?: string; 
    feedback?: string;
    submittedAt?: Date;
  } | null;
};

export interface IStudentAssignmentService {
  listAssignmentsWithStatus(topicId: string, studentId: string): Promise<AssignmentWithStatus[]>;

  createSubmissionService(
    data: { topicId: string; response: string; fileKey: string },
    studentId: string,
    assignmentId: string,
  ): Promise<ISubmission>;

  getSubmission(assignmentId: string, studentId: string): Promise<ISubmission>;

  updateSubmissionByAssignment(
    assignmentId: string,
    studentId: string,
    data: { response: string; fileKey: string },
  ): Promise<ISubmission | null>;
}
