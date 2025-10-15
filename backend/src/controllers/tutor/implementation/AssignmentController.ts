import { Request, Response } from 'express';
import { HttpStatus } from '../../../constants/statusCode';
import { IAssignmentService } from '../../../services/tutor/IAssignmentService';

export class AssignmentController {
  constructor(private assignmentService: IAssignmentService) {}

  createAssignment = async (req: Request, res: Response) => {
    try {
      const { topicId } = req.params;
      const assignment = await this.assignmentService.createAssignment(topicId, req.body);
      res.status(HttpStatus.CREATED).json(assignment);
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create assignment' });
    }
  };

  getAssignmentsByTopic = async (req: Request, res: Response) => {
    try {
      const { topicId } = req.params;
      const {
        page = 1,
        limit = 10,
        search = '',
      } = req.query as {
        page?: string;
        limit?: string;
        search?: string;
      };

      const allAssignments = await this.assignmentService.getAssignmentsByTopic(topicId);
      const filtered = allAssignments.filter((a) =>
        a.title.toLowerCase().includes(search.toLowerCase()),
      );

      const startIndex = (Number(page) - 1) * Number(limit);
      const paginated = filtered.slice(startIndex, startIndex + Number(limit));

      res.status(HttpStatus.OK).json({
        total: filtered.length,
        page: Number(page),
        limit: Number(limit),
        data: paginated,
      });
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch assignments' });
    }
  };

  getAssignmentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const assignment = await this.assignmentService.getAssignmentById(id);
      if (!assignment) {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'Assignment not found' });
        return;
      }
      res.status(HttpStatus.OK).json(assignment);
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch assignment' });
    }
  };

  updateAssignment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updated = await this.assignmentService.updateAssignment(id, req.body);
      if (!updated) {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'Assignment not found' });
        return;
      }
      res.status(HttpStatus.OK).json({ message: 'Assignment updated successfully', updated });
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update assignment' });
    }
  };

  deleteAssignment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.assignmentService.deleteAssignment(id);
      res.status(HttpStatus.OK).json({ message: 'Assignment deleted (soft)' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete assignment' });
    }
  };
}
