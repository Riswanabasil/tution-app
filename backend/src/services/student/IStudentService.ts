import { Istudent } from "../../models/student/studentSchema";

export interface IStudentService{
    registerStudentService(name:string, email:string,phone:string,password:string):Promise<Istudent>
}