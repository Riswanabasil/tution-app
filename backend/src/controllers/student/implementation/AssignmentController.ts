import { NextFunction, Request, Response } from 'express';
import { AuthenticatedRequest } from '../../../types/Index';
import { StudentAssignmentService } from '../../../services/student/implementation/StudentAssignmentService';
import { presignPutObject } from '../../../utils/s3Presign';
import { HttpStatus } from '../../../constants/statusCode';
import { ERROR_MESSAGES } from '../../../constants/errorMessages';

export class AssignmentController {
  constructor(private assgnService: StudentAssignmentService) {}

  async getAssignmentsForStudent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const studentId = req.user!.id;

      const topicId = req.params.topicId;

      const data = await this.assgnService.listAssignmentsWithStatus(topicId, studentId);
      res.status(HttpStatus.OK).json(data);
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
  async generatePresignedUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const { filename, contentType } = req.query as { filename: string; contentType: string };
      const data = await presignPutObject({ keyPrefix: 'submission', filename, contentType });
      res.json(data);
    } catch (err) {
      next(err);
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
    } catch (error) {
      console.log(error);

      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }

  async getStudentSubmissionByAssignment(req: AuthenticatedRequest, res: Response) {
    try {
      const { assignmentId } = req.params;
      const studentId = req.user!.id;

      const submission = await this.assgnService.getSubmission(assignmentId, studentId);
      res.status(HttpStatus.OK).json(submission);
    } catch (err) {
      res.status(HttpStatus.NOT_FOUND).json({ error: 'Submission not found' });
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

      res.status(HttpStatus.OK).json(updated);
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: ERROR_MESSAGES.BAD_REQUEST });
    }
  }
}
