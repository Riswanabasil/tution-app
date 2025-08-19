import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../../types/Index";

export interface IVideoController {
  getVideoUploadUrl(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
  createVideo(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
  listByTopic(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
  update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
  remove(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
