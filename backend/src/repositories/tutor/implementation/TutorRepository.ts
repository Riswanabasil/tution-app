import Tutor, { ITutor } from "../../../models/tutor/TutorSchema";
import { Course, ICourse } from "../../../models/course/CourseSchema";
import { ITutorRepository } from "../ITutorRepository";
import { BaseRepository } from "../../base/BaseRepository";
import { EnrollmentModel } from "../../../models/payment/Enrollment";

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

  // async assignCoursesToTutor(
  //   tutorId: string,
  //   courseIds: string[]
  // ): Promise<ITutor | null> {
  //   const updatedTutor = Tutor.findByIdAndUpdate(
  //     tutorId,
  //     { assignedCourses: courseIds },
  //     { new: true }
  //   ).populate("assignedCourses");

  //   return updatedTutor;
  // }

  // async findCoursesByTutorId(tutorId: string): Promise<ICourse[]> {
  //   const tutor = await Tutor.findById(tutorId).populate<{
  //     assignedCourses: ICourse[];
  //   }>("assignedCourses");

  //   return (tutor?.assignedCourses as ICourse[]) || [];
  // }

  async updateById(id: string, updates: any) {
    return Tutor.findByIdAndUpdate(id, updates, { new: true })
      .select("-password")
      .lean()
      .exec();
  }

  async countCoursesByTutor(tutorId: string) {
    return Course.countDocuments({ tutor: tutorId }).exec();
  }

  async countStudentsByTutor(tutorId: string) {
    const courses = await Course.find({ tutor: tutorId }).select("_id").lean();
    const ids = courses.map((c) => c._id);
    return EnrollmentModel.countDocuments({
      courseId: { $in: ids },
      status: "paid",
    }).exec();
  }

  async findCoursesByTutor(tutorId: string) {
    const courses = await Course.find({ tutor: tutorId })
      .select("title status")
      .lean();

    //  aggregate
    return Promise.all(
      courses.map(async (c) => {
        const studentCount = await EnrollmentModel.countDocuments({
          courseId: c._id,
          status: "paid",
        }).exec();
        return {
          _id:          c._id.toString(),
          title:        c.title,
          status:       c.status,
          studentCount,
        };
      })
    );
  }
 async incrementWallet(tutorId: string, amount: number): Promise<void> {
    await Tutor.findByIdAndUpdate(
      tutorId,
      { $inc: { walletBalance: amount } },
      { new: true }
    ).exec();
  }
  
}
