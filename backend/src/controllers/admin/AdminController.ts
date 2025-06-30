// import { Request,Response } from "express";
// import { generateAccessToken, generateRefreshToken } from "../../utils/GenerateToken";
// export const loginAdmin=async (req:Request,res:Response):Promise<void>=>{
//    try{
//      const {email,password}=req.body

//     if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
//   res.status(401).json({ message: "Invalid credentials" });
//   return;
// }

//  const accessToken = await generateAccessToken("admin",email,"admin")
//   const refreshToken= await generateRefreshToken("admin",email,"admin")

//   res.cookie("adminRefreshToken", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000 
//     })

//     res.status(200).json({
//       message: "Admin login successful",
//       accessToken
//     });
//    }catch (error) {
//     res.status(500).json({ message: "Login failed" });
//   }
// }


// export const logoutAdmin = (req: Request, res: Response): void => {
//   res.clearCookie("adminRefreshToken", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//   });

//   res.status(200).json({ message: "Admin logged out successfully" });
// };


// export const getAllStudents = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const students = await studentRepository.findAll();
//     res.status(200).json(students);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch students' });
//   }
// };

