import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../../types/Index";

export interface IStudentVideoController {
  listByTopic(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
  upsertProgress(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
