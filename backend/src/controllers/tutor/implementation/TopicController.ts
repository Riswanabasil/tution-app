import { Request, Response } from 'express';
import { TopicService } from '../../../services/tutor/implementation/TopicService';
import mongoose from 'mongoose';

export class TopicController {
  constructor(private readonly service: TopicService) {}

   create = async (req: Request, res: Response) => {
    try {
      const moduleId = new mongoose.Types.ObjectId(req.params.moduleId);
      console.log(req.body);
      
      const { title, description, order } = req.body;

      const topic = await this.service.create({ title, description, order, moduleId });
      res.status(201).json(topic);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to create topic' });
    }
  };

  getByModule = async (req: Request, res: Response) => {
    try {
      const topics = await this.service.getByModule(req.params.moduleId);
      res.json({topics:topics});
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch topics' });
    }
  };

getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const topic = await this.service.getById(req.params.id);
    if (!topic) {
      res.status(404).json({ message: "Topic not found" });
      return;
    }
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

  update = async (req: Request, res: Response) => {
    try {
      const updated = await this.service.update(req.params.id, req.body);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to update topic' });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.service.delete(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to delete topic' });
    }
  };
}
