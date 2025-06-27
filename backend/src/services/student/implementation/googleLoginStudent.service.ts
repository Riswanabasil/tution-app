
// import { StudentRepository } from "../../../repositories/student/implementation/studentRepository";
// import { generateAccessToken,generateRefreshToken } from "../../../utils/GenerateToken";
// import { OAuth2Client } from "google-auth-library";

// const client=new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
// const studentRepo= new StudentRepository()

// export const googleLoginStudentService= async (idToken:string)=>{
  
//     const ticket= await client.verifyIdToken({
//         idToken,
//     audience: process.env.GOOGLE_CLIENT_ID
//     })

//     const payload=ticket.getPayload()
   
    

//      if (!payload || !payload.email || !payload.name) {
//     throw new Error('Invalid Google token');
//   }

//   const { email, name } = payload;

//    let student = await studentRepo.findByEmail(email);
   

//    if (!student) {
//     student = await studentRepo.create({
//       name,
//       email,
//       password: '',
//       phone: '',
//       isGoogleSignup: true,
//       isVerified: true,
//       role: 'student'
//     });
//   }

//    const accessToken = generateAccessToken(student._id.toString(), student.email, student.role);
//   const refreshToken = generateRefreshToken(student._id.toString(), student.email, student.role);
  
//   return {
//     accessToken,
//     refreshToken,
//     student: {
//       id: student._id,
//       name: student.name,
//       email: student.email
//     }
//   }
// }