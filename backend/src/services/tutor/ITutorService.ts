import { ITutor } from "../../models/tutor/TutorSchema";

export interface ITutorService {
  registerTutorService(name: string, email: string, phone: string, password: string): Promise<ITutor>;
}
