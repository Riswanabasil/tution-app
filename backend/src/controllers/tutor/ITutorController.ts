import { Request, Response } from "express";

export interface ITutorController {
  registerTutor(req: Request, res: Response): Promise<void>;
}
