import { IStudent } from "../../models/student/studentSchema";

export interface IStudentRepository{
    create(student: Partial<IStudent>): Promise<IStudent>;
  findById(id: string): Promise<IStudent | null>;
  findAll(): Promise<IStudent[]>;
  update(id: string, data: Partial<IStudent>): Promise<IStudent | null>;
  delete(id: string): Promise<boolean>;

 
  findByEmail(email: string): Promise<IStudent | null>;
  updateIsVerified(email: string): Promise<void>
}