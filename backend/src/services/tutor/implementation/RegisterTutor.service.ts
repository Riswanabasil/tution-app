// import { ITutor } from "../../../models/tutor/TutorSchema";
// import { TutorRepository } from "../../../repositories/tutor/implementation/TutorRepository";
// import bcrypt from "bcrypt"

// const tutorRepo= new TutorRepository()

// export const registerTutorService=async(
//     name:string,
//     email:string,
//     phone:string,
//     password:string
// ):Promise<ITutor>=>{
//     const existing= await tutorRepo.findByEmail(email)
//     if(existing){
//         throw new Error("Tutor already exists")
//     }

//     const hashedPassword= await bcrypt.hash(password,10)

//     const newTutor= await tutorRepo.create({
//     name,
//     email,
//     phone,
//     password: hashedPassword,
//     isGoogleSignup: false,
//     status: "pending",
//     role: "tutor"
//     })

//     return newTutor
// }