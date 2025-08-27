import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../../types/Index';
import { StudentAssignmentService } from '../../../services/student/implementation/StudentAssignmentService';

export class AssignmentController {
  constructor(private assgnService: StudentAssignmentService) {}

  async getAssignmentsForStudent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const studentId = req.user!.id;

      const topicId = req.params.topicId;

      const data = await this.assgnService.listAssignmentsWithStatus(topicId, studentId);
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async createSubmissionController(req: AuthenticatedRequest, res: Response) {
    try {
      const assignmentId = req.params.assignmentId;
      console.log(assignmentId);

      const studentId = req.user!.id;
      const data = req.body;

      const submission = await this.assgnService.createSubmissionService(
        data,
        studentId,
        assignmentId,
      );

      res.status(201).json({ message: 'Submission created successfully', submission });
    } catch (error: any) {
      console.log(error);

      res.status(500).json({ error: error.message });
    }
  }

  async getStudentSubmissionByAssignment(req: AuthenticatedRequest, res: Response) {
    try {
      const { assignmentId } = req.params;
      const studentId = req.user!.id;

      const submission = await this.assgnService.getSubmission(assignmentId, studentId);
      res.status(200).json(submission);
    } catch (err: any) {
      res.status(404).json({ error: err.message || 'Submission not found' });
    }
  }

  async updateSubmissionByAssignment(req: AuthenticatedRequest, res: Response) {
    const { assignmentId } = req.params;
    try {
      const studentId = req.user!.id;
      const { response, fileKey } = req.body;

      const updated = await this.assgnService.updateSubmissionByAssignment(
        assignmentId,
        studentId,
        { response, fileKey },
      );

      res.status(200).json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
