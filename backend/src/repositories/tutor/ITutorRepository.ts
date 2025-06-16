import { ITutor } from "../../models/tutor/TutorSchema";

export interface ITutorRepository{
    findByEmail(email:string):Promise<ITutor | null>
}