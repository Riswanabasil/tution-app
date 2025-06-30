import { ITutor } from "../../models/tutor/TutorSchema";

export interface ITutorRepository{
    create(student: Partial<ITutor>): Promise<ITutor>
    findByEmail(email:string):Promise<ITutor | null>
    updateVerificationById(
      tutorId: string,
      verificationDetails: {
        summary: string;
        education: string;
        experience: string;
        idProof: string;
        resume: string;
      },
    ): Promise<ITutor | null>
    getAllWithFilters(
        query: any,
        skip: number,
        limit: number
      ): Promise<ITutor[]>
      countAllWithFilters(query: any): Promise<number>
      getTutorById(id: string): Promise<ITutor | null>
      updateTutorStatus(
    id: string,
    status: "approved" | "rejected"
  ): Promise<Boolean>
}