import { ITutor } from '../../models/tutor/TutorSchema';
import { RegisterTutorResponse } from './implementation/TutorService';

export interface ITutorService {
  registerTutor(
    name: string,
    email: string,
    phone: string,
    password: string,
  ): Promise<RegisterTutorResponse>;
}
