import { ITutor } from "../../../models/tutor/TutorSchema";
import { TutorRepository } from "../../../repositories/tutor/implementation/TutorRepository";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/GenerateToken";

const tutorRepo = new TutorRepository();

export const loginTutorService = async (
  email: string,
  password: string
): Promise<{ refreshToken: string; accesToken: string; tutor: ITutor }> => {
  const tutor = await tutorRepo.findByEmail(email);

  if (!tutor){
    throw new Error("Tutor not found");
    
    
  } 

      if (tutor.status !== 'approved') {
        
      throw new Error("VERIFICATION_PENDING");
    }

  const validPassword = await bcrypt.compare(password, tutor.password);

  if (!validPassword) throw new Error("Incorrect password");

  const accesToken = generateAccessToken(
    tutor._id.toString(),
    tutor.email,
    tutor.role
  );
  const refreshToken = generateRefreshToken(
    tutor._id.toString(),
    tutor.email,
    tutor.role
  );
  return { accesToken, refreshToken, tutor };
};
