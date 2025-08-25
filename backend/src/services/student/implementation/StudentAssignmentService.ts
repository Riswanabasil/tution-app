import mongoose from 'mongoose';
import { ISubmission } from '../../../models/submission/SubmissionSchema';
import { AssignmentRepository } from '../../../repositories/assignment/implementation/AssignmentRepository';
import { SubmissionRepository } from '../../../repositories/submission/SubmissionRepository';

export class StudentAssignmentService {
  constructor(
    private assignmentRepo: AssignmentRepository,
    private submissionRepo: SubmissionRepository
  ) {}

  async listAssignmentsWithStatus(topicId: string, studentId: string) {
    const assignments = await this.assignmentRepo.findByTopic(topicId);
    const assignmentIds = assignments.map(a => a._id.toString());

    const submissions = await this.submissionRepo.findByStudentAndAssignments(studentId, assignmentIds);
    const submissionMap = new Map(submissions.map(s => [s.assignmentId.toString(), s]));

    const now = new Date();

    const enriched = assignments.map(assignment => {
      const submission = submissionMap.get(assignment._id.toString());

      let status: 'expired' | 'not submitted' | 'pending' | 'verified';

      if (!submission) {
        status = assignment.dueDate < now ? 'expired' : 'not submitted';
      } else {
        status = submission.status as 'pending' | 'verified'; 
      }

      return {
        _id: assignment._id,
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
        status,
        submission: submission ? {
          _id: submission._id,
          submittedFiles: submission.submittedFile,
          feedback: submission.feedback,
          submittedAt: submission.createdAt
        } : null
      };
    });

    return enriched;
  }

  async createSubmissionService(
  data: {
    topicId: string;
    response: string;
    FileKey: string; 
  },
  studentId: string,
  assignmentId: string
) {
  const { topicId, response, FileKey } = data;

  const assgn = new mongoose.Types.ObjectId(assignmentId);
  const assignment = await this.assignmentRepo.findById(assgn);
  if (!assignment) throw new Error("Assignment not found");

  const courseId = assignment.courseId;

  const submittedFile = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${encodeURIComponent(FileKey)}`;

  const toSave: Partial<ISubmission> = {
    studentId,
    topicId,
    courseId,
    assignmentId,
    response,
    submittedFile, 
    status: "pending",
  };

  return await this.submissionRepo.create(toSave);
}
 async getSubmission(assignmentId: string, studentId: string) {
    const submission = await this.submissionRepo.findByAssignmentAndStudent(assignmentId, studentId);
    if (!submission) throw new Error("Submission not found");
    return submission;
  }

  async updateSubmissionByAssignment(
    assignmentId: string,
    studentId: string,
    data: { response: string; fileKey: string }
  ) {
    const {  response, fileKey } = data;
    const existing = await this.submissionRepo.findByAssignmentAndStudent(
      assignmentId,
      studentId
    );

    if (!existing) {
      throw new Error("Submission not found for this assignment and student");
    }
const submittedFile = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${encodeURIComponent(fileKey)}`;
    return await this.submissionRepo.updateSubmissionByAssignmentAndStudent(
      assignmentId,
      studentId,
      response,
      submittedFile
    );
  }
}
