import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../types/Index";

export interface IStudentController{
    registerStudent(req:Request, res:Response):Promise<void>
    verifyStudentOtp(req: AuthenticatedRequest, res: Response): Promise<void>
    resendOtp(req: AuthenticatedRequest, res: Response): Promise<void>
}