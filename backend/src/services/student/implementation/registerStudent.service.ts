// import { IStudentService } from "../IStudentService";
// import { IStudent } from "../../../models/student/studentSchema";
// import { StudentRepository } from "../../../repositories/student/implementation/studentRepository";
// import bcrypt from 'bcrypt'

// const studentRepository= new StudentRepository()

// export class StudentService implements IStudentService{
//     async registerStudentService(name: string, email: string,phone:string, password: string): Promise<IStudent> {
//         const existing= await studentRepository.findByEmail(email)
//         if (existing){
//             throw new Error('Student already exists')
//         }
//         const hashedPassword=await bcrypt.hash(password,10)

//         const newStudent= await studentRepository.create({
//       name,
//       email,
//       phone,
//       password: hashedPassword,
//     } as IStudent)

//     return newStudent
//     }
// }