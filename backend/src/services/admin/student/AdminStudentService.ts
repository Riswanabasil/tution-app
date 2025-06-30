// import { StudentRepository } from "../../../repositories/student/implementation/studentRepository";
// import { IStudent } from "../../../models/student/studentSchema";

// const studentRepo = new StudentRepository();

// export const getAllStudentsService = async (
//   page: number,
//   limit: number,
//   search: string,
//   sort: string,
//   order: number
// ): Promise<{ students: IStudent[]; totalPages: number }> => {
//   const skip = (page - 1) * limit;
//   const sortOrder = order

//   const filter = search
//     ? {
//         $or: [
//           { name: { $regex: search, $options: "i" } },
//           { email: { $regex: search, $options: "i" } },
//         ],
//       }
//     : {};

//   const total = await studentRepo.countDocuments(filter);

//   const students = await studentRepo.findMany(filter, {
//     skip,
//     limit,
//     sort: { [sort]: sortOrder },
//   });

//   return {
//     students,
//     totalPages: Math.ceil(total / limit),
//   };
// };

// export const toggleBlockStudentService = async (
//   studentId: string,
//   blockStatus: boolean
// ): Promise<void> => {
//   const student = await studentRepo.findById(studentId);
//   if (!student) throw new Error("Student not found");
//   await studentRepo.updateBlockStatus(studentId, blockStatus);
// };

