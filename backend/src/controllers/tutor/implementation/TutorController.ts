import { Request,Response } from "express";
import { registerTutorService } from "../../../services/tutor/implementation/RegisterTutor.service";
import { loginTutorService } from "../../../services/tutor/implementation/LoginTutor.service";
import { submitTutorVerificationService } from "../../../services/tutor/implementation/Verification.service";

export class TutorController {
  async registerTutor(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, password } = req.body;
      const tutor = await registerTutorService(name, email, phone, password);

      res.status(201).json({
        message: "Tutor registered successfully",
        tutor: {
          id: tutor._id,
          name: tutor.name,
          email: tutor.email,
          phone: tutor.phone,
          role: tutor.role,
          status: tutor.status
        }
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async loginTutor(req:Request,res:Response):Promise<void>{
      try{
        
        const {email,password}=req.body
        
        
        const {accesToken,refreshToken,tutor}= await loginTutorService(email,password)
        res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 
      });
  
      res.status(200).json({
        message: 'Login successful',
        accesToken,
        tutor
      });
      }catch (error: any) {
      res.status(401).json({ message: error.message });
    }
    }

    async submitVerificationController (req: Request, res: Response): Promise<void>{
  try {
    const { tutorId, summary, education, experience } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const idProof = files['idProof']?.[0]?.filename;
    const resume = files['resume']?.[0]?.filename;


    if (!tutorId || !idProof || !resume) {
      res.status(400).json({ message: 'Missing required fields' });
return;

    }

    const updatedTutor = await submitTutorVerificationService(
      tutorId,
      summary,
      education,
      experience,
      idProof,
      resume
    );

    res.status(200).json({
      message: 'Tutor verification submitted successfully',
      tutor: updatedTutor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
}