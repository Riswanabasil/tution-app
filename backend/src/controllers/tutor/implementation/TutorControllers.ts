import { NextFunction, Request, Response } from 'express';
import {
  TutorService,
  RegisterTutorResponse,
  TutorVerificationInput,
  LoginTutorResponse,
} from '../../../services/tutor/implementation/TutorService';
import { ITutorController } from '../ITutorController';
import { AuthenticatedRequest } from '../../../types/Index';
import { presignPutObject } from '../../../utils/s3Presign';
import { HttpStatus } from '../../../constants/statusCode';
import { ERROR_MESSAGES } from '../../../constants/errorMessages';

export class TutorController implements ITutorController {
  constructor(private tutorService: TutorService) {}

  async registerTutor(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, password } = req.body;
      const tutor: RegisterTutorResponse = await this.tutorService.registerTutor(
        name,
        email,
        phone,
        password,
      );

      res.status(HttpStatus.CREATED).json({
        message: 'Tutor registered successfully',
        tutor,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: ERROR_MESSAGES.BAD_REQUEST });
    }
  }

  async submitTutorVerification(req: Request, res: Response): Promise<void> {
    try {
      const { summary, education, experience, tutorId } = req.body;
      const files = req.files as Record<string, Express.Multer.File[]>;
      const idProof = files['idProof']?.[0].filename;
      const resume = files['resume']?.[0].filename;

      if (!tutorId || !idProof || !resume || !summary || !education || !experience) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'Missing required fields' });
        return;
      }

      const input: TutorVerificationInput = { summary, education, experience, idProof, resume };
      const updatedTutor = await this.tutorService.submitTutorVerification(tutorId, input);

      res.status(HttpStatus.OK).json({
        message: 'Tutor verification submitted successfully',
        tutor: updatedTutor,
      });
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }

  async loginTutor(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result: LoginTutorResponse = await this.tutorService.loginTutor(email, password);
      const REFRESH_COOKIE=Number(process.env.MAX_AGE)
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(HttpStatus.OK).json({
        message: 'Login successful',
        accessToken: result.accessToken,
        tutor: result.tutor,
      });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: ERROR_MESSAGES.UNAUTHORIZED });
    }
  }
  async logoutTutor(req: Request, res: Response): Promise<void> {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(HttpStatus.OK).json({ message: 'Tutor logged out successfully' });
  }

  async googleLoginTutor(req: Request, res: Response): Promise<void> {
    try {
      const { idToken } = req.body as { idToken?: string };
      if (!idToken) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'Google ID token missing' });
        return;
      }

      const { accessToken, refreshToken, tutor } =
        await this.tutorService.googleLoginTutorService(idToken);

  const REFRESH_COOKIE=Number(process.env.MAX_AGE)
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(HttpStatus.OK).json({
        message: 'Google login successful',
        accessToken,
        tutor,
      });
    } catch (err: any) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: err.message || 'Unauthorized' });
    }
  }


  async refreshAccessToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: 'No refresh token provided' });
        return;
      }

      const newAccessToken = await this.tutorService.refreshAccessToken(refreshToken);

      res.status(HttpStatus.OK).json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(HttpStatus.FORBIDDEN).json({ message: ERROR_MESSAGES.FORBIDDEN });
    }
  }

  //profile
  async getProfileUploadUrl(req: Request, res: Response, next: NextFunction) {
      try {
        const { filename, contentType } = req.query as { filename: string; contentType: string };
        const data = await presignPutObject({ keyPrefix: 'TutorPic', filename, contentType });
        res.json(data);
      } catch (err) {
        next(err);
      }
    }

  async getProfile(req: AuthenticatedRequest, res: Response) {
    const tutorId = req.user!.id;
    const data = await this.tutorService.getProfile(tutorId);
    res.json({ data });
  }

  async updateProfile(req: AuthenticatedRequest, res: Response) {
    const tutorId = req.user!.id;

    const profileKey = req.body.profilePicKey as string | undefined;

    const profileilUrl = profileKey
      ? `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/` +
        encodeURIComponent(profileKey)
      : undefined;
    const updates = {
      ...req.body,
      profilePic: profileilUrl,
    };
    const data = await this.tutorService.updateProfile(tutorId, updates);
    res.json({ data });
  }

  async changePassword(req: AuthenticatedRequest, res: Response) {
    const tutorId = req.user!.id;
    const { currentPassword, newPassword } = req.body;
    await this.tutorService.changePassword(tutorId, currentPassword, newPassword);
    res.json({ message: 'Password updated' });
  }

  async getStats(req: AuthenticatedRequest, res: Response) {
    const tutorId = req.user!.id;
    const data = await this.tutorService.getStats(tutorId);
    res.json({ data });
  }

  async getMyCourses(req: AuthenticatedRequest, res: Response) {
    const tutorId = req.user!.id;
    const data = await this.tutorService.getMyCourses(tutorId);
    res.json({ data });
  }
}
