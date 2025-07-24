import { Request, Response } from "express";
import { NoteService } from "../../../services/tutor/implementation/NoteService";
import mongoose from "mongoose";

export class NoteController {
  constructor(private readonly service: NoteService) {}
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const topicId = new mongoose.Types.ObjectId(req.params.topicId);
      const { pdfKeys } = req.body;
      if (!topicId || !Array.isArray(pdfKeys) || pdfKeys.length === 0) {
        res.status(400).json({ message: "Missing topicId or pdfKeys" });
        return;
      }
      const pdfUrls = pdfKeys.map(
        (key: string) =>
          `https://${process.env.S3_BUCKET_NAME}.s3.${
            process.env.AWS_REGION
          }.amazonaws.com/${encodeURIComponent(key)}`
      );
      const note = await this.service.create({ topicId, pdfUrls });
      res.status(201).json(note);
    } catch (err) {
      console.error("Create Note Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  getByTopic = async (req: Request, res: Response): Promise<void> => {
    try {
      const notes = await this.service.getByTopic(req.params.topicId);
      res.json(notes);
    } catch (err) {
      console.error("Get Notes by Topic Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const note = await this.service.getById(req.params.id);
      if (!note) {
        res.status(404).json({ message: "Note not found" });
        return;
      }
      res.json(note);
    } catch (err) {
      console.error("Get Note by ID Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { pdfKeys } = req.body;
      const pdfUrls = pdfKeys.map(
        (key: string) =>
          `https://${process.env.S3_BUCKET_NAME}.s3.${
            process.env.AWS_REGION
          }.amazonaws.com/${encodeURIComponent(key)}`
      );
      const note = await this.service.update(req.params.id, { pdfUrls });
      res.json(note);
    } catch (err) {
      console.error("Update Note Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.service.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      console.error("Delete Note Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
