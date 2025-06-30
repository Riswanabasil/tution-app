import Tutor, { ITutor } from "../../../models/tutor/TutorSchema";
import { ICourse } from "../../../models/CourseSchema";
import { ITutorRepository } from "../ITutorRepository";
import { BaseRepository } from "../../base/BaseRepository";
import { Types } from "mongoose";

export class TutorRepository
  extends BaseRepository<ITutor>
  implements ITutorRepository
{
  constructor() {
    super(Tutor);
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
    }
  ): Promise<ITutor | null> {
    return Tutor.findByIdAndUpdate(
      tutorId,
      {
        status: "verification-submitted",
        verificationDetails,
      },
      { new: true }
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
      .sort({ createdAt: -1 })
      // .populate("assignedCourses", "title");
  }

  async countAllWithFilters(query: any): Promise<number> {
    return Tutor.countDocuments(query);
  }

  async getTutorById(id: string): Promise<ITutor | null> {
    return Tutor.findById(id);
  }
  async updateTutorStatus(
    id: string,
    status: "approved" | "rejected"
  ): Promise<Boolean> {
    const updated = await Tutor.findByIdAndUpdate(id, { status });
    return !!updated;
  }

  async assignCoursesToTutor(
    tutorId: string,
    courseIds: string[]
  ): Promise<ITutor | null> {
    const updatedTutor = Tutor.findByIdAndUpdate(
      tutorId,
      { assignedCourses: courseIds },
      { new: true }
    ).populate("assignedCourses");

    return updatedTutor;
  }

  async findCoursesByTutorId(tutorId: string): Promise<ICourse[]> {
    const tutor = await Tutor.findById(tutorId).populate<{
      assignedCourses: ICourse[];
    }>("assignedCourses");

    return (tutor?.assignedCourses as ICourse[]) || [];
  }
}
