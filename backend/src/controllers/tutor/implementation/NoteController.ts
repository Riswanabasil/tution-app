import { NextFunction, Request, Response } from 'express';
import { NoteService } from '../../../services/tutor/implementation/NoteService';
import mongoose from 'mongoose';
import { presignPutObject } from '../../../utils/s3Presign';
import { HttpStatus } from '../../../constants/statusCode';

export class NoteController {
  constructor(private readonly service: NoteService) {}

  async getNoteUploadUrls(req: Request, res: Response, next: NextFunction) {
    try {
      const { filename, contentType } = req.query as { filename: string; contentType: string };
      const data = await presignPutObject({ keyPrefix: 'notes', filename, contentType });
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const topicId = new mongoose.Types.ObjectId(req.params.topicId);
      const { pdfKeys } = req.body;
      if (!topicId || !Array.isArray(pdfKeys) || pdfKeys.length === 0) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'Missing topicId or pdfKeys' });
        return;
      }
      const pdfUrls = pdfKeys.map(
        (key: string) =>
          `https://${process.env.S3_BUCKET_NAME}.s3.${
            process.env.AWS_REGION
          }.amazonaws.com/${encodeURIComponent(key)}`,
      );
      const note = await this.service.create({ topicId, pdfUrls });
      res.status(HttpStatus.CREATED).json(note);
    } catch (err) {
      console.error('Create Note Error:', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  };
  getByTopic = async (req: Request, res: Response): Promise<void> => {
    try {
      const notes = await this.service.getByTopic(req.params.topicId);
      res.json(notes);
    } catch (err) {
      console.error('Get Notes by Topic Error:', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  };
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const note = await this.service.getById(req.params.id);
      if (!note) {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'Note not found' });
        return;
      }
      res.json(note);
    } catch (err) {
      console.error('Get Note by ID Error:', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  };
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { pdfKeys } = req.body;
      const pdfUrls = pdfKeys.map(
        (key: string) =>
          `https://${process.env.S3_BUCKET_NAME}.s3.${
            process.env.AWS_REGION
          }.amazonaws.com/${encodeURIComponent(key)}`,
      );
      const note = await this.service.update(req.params.id, { pdfUrls });
      res.json(note);
    } catch (err) {
      console.error('Update Note Error:', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  };
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.service.delete(req.params.id);
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (err) {
      console.error('Delete Note Error:', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  };
}
