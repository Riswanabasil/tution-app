import Tutor,{ITutor} from "../../../models/tutor/TutorSchema";

import { ITutorRepository } from "../ITutorRepository";
import { BaseRepository } from "../../base/BaseRepository";

export class TutorRepository extends BaseRepository<ITutor> implements ITutorRepository{
    constructor(){
        super(Tutor)
    }

     async findByEmail(email: string): Promise<ITutor | null> {
    return Tutor.findOne({ email });
  }

  async updateVerificationById(
  tutorId: string,
  verificationDetails: {
    summary: string;
    education: string;
    experience: string;
    idProof: string;
    resume: string;
  },
): Promise<ITutor | null> {
  return Tutor.findByIdAndUpdate(
    tutorId,
    {
      status: 'verification-submitted',
      verificationDetails,
    },
    { new: true },
  );
}


async getAllWithFilters(
  query: any,
  skip: number,
  limit: number
): Promise<ITutor[]> {
  return Tutor.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 }); 
}


async countAllWithFilters(query: any): Promise<number> {
  return Tutor.countDocuments(query);
}

async getTutorById(id: string): Promise<ITutor | null> {
  return Tutor.findById(id);
}
async updateTutorStatus(id:string,status:'approved'|'rejected'):Promise<Boolean>{
  const updated= await Tutor.findByIdAndUpdate(id,{status})
  return !!updated
}
}