import { Request, Response } from 'express';
import { AssignmentService } from '../../../services/tutor/implementation/AssignmentService';

export class AssignmentController {
  constructor(private assignmentService: AssignmentService) {}

  createAssignment = async (req: Request, res: Response) => {
    try {
      const { topicId } = req.params;
      const assignment = await this.assignmentService.createAssignment(topicId, req.body);
      res.status(201).json(assignment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create assignment' });
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

      res.status(200).json({
        total: filtered.length,
        page: Number(page),
        limit: Number(limit),
        data: paginated,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch assignments' });
    }
  };

  getAssignmentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const assignment = await this.assignmentService.getAssignmentById(id);
      if (!assignment) {
        res.status(404).json({ message: 'Assignment not found' });
        return;
      }
      res.status(200).json(assignment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch assignment' });
    }
  };

  updateAssignment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updated = await this.assignmentService.updateAssignment(id, req.body);
      if (!updated) {
        res.status(404).json({ message: 'Assignment not found' });
        return;
      }
      res.status(200).json({ message: 'Assignment updated successfully', updated });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update assignment' });
    }
  };

  deleteAssignment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.assignmentService.deleteAssignment(id);
      res.status(200).json({ message: 'Assignment deleted (soft)' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete assignment' });
    }
  };
}
