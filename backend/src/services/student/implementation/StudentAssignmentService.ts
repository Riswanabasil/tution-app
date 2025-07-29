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
          submittedFiles: submission.submittedFiles,
          feedback: submission.feedback,
          submittedAt: submission.createdAt
        } : null
      };
    });

    return enriched;
  }
}
