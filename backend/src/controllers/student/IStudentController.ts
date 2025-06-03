import { Request, Response } from "express";

export interface IStudentController{
    registerStudent(req:Request, res:Response):Promise<void>
}