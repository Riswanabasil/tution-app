import { Request, Response } from "express";
import { TutorService, RegisterTutorResponse, TutorVerificationInput, LoginTutorResponse } from "../../../services/tutor/implementation/TutorService";
import { ITutorController } from "../ITutorController";

export class TutorController implements ITutorController {
  constructor(private tutorService: TutorService) {}

  async registerTutor(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, password } = req.body;
      const tutor: RegisterTutorResponse = await this.tutorService.registerTutor(
        name,
        email,
        phone,
        password
      );

      res.status(201).json({
        message: "Tutor registered successfully",
        tutor,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

   async submitTutorVerification(req: Request, res: Response): Promise<void> {
    try {
      const { summary, education, experience, tutorId } = req.body;
      const files = req.files as Record<string, Express.Multer.File[]>;
      const idProof = files['idProof']?.[0].filename;
      const resume = files['resume']?.[0].filename;

      if (!tutorId || !idProof || !resume || !summary || !education || !experience) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }

      const input: TutorVerificationInput = { summary, education, experience, idProof, resume };
      const updatedTutor = await this.tutorService.submitTutorVerification(tutorId, input);

      res.status(200).json({
        message: "Tutor verification submitted successfully",
        tutor: updatedTutor,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  }

  async loginTutor(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result: LoginTutorResponse = await this.tutorService.loginTutor(
        email,
        password
      );
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        message: "Login successful",
        accessToken: result.accessToken,
        tutor: result.tutor
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message || "Login failed" });
    }
  }

  async refreshAccessToken(req: Request, res: Response): Promise<void> {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ message: 'No refresh token provided' });
      return;
    }

    const newAccessToken = await this.tutorService.refreshAccessToken(refreshToken);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error: any) {
    res.status(403).json({ message: error.message || 'Invalid refresh token' });
  }
}
}
