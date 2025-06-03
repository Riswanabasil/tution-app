import { Istudent } from "../../models/student/studentSchema";

export interface IstudentRepository{
    create(student: Istudent): Promise<Istudent>;
  findById(id: string): Promise<Istudent | null>;
  findAll(): Promise<Istudent[]>;
  update(id: string, data: Partial<Istudent>): Promise<Istudent | null>;
  delete(id: string): Promise<boolean>;

 
  findByEmail(email: string): Promise<Istudent | null>;
}