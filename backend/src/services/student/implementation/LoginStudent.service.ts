import bcrypt from 'bcrypt'
import { StudentRepository } from '../../../repositories/student/implementation/studentRepository'
import { generateAccessToken, generateRefreshToken } from '../../../utils/GenerateToken'


const studentRepo= new StudentRepository()

export const loginStudentService=async (email:string,password:string)=>{
    const student =await studentRepo.findByEmail(email)
    if(!student){
        throw new Error('Student not found');
    }

    if (!student.isVerified) {
    throw new Error('Please verify your email before logging in');
  }
  const isMatch = await bcrypt.compare(password, student.password);

   if (!isMatch) {
    throw new Error('Invalid password');
  }

  const accessToken = generateAccessToken(student._id.toString(), student.email, student.role);

  const refreshToken=generateRefreshToken(student._id.toString(),student.email,student.role)

  return {
    accessToken,
    refreshToken,
    student: {
      id: student._id,
      email: student.email,
      name: student.name
    }
  };
}