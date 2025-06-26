import { ITutorAdminService } from "../ITutorAdminService";
import { TutorRepository } from "../../../../repositories/tutor/implementation/TutorRepository";
import {
  PaginatedTutors,
  TutorDetails,
} from "../../../../types/TutorAdminTypes";
import { ITutor } from "../../../../models/tutor/TutorSchema";

const tutorRepo = new TutorRepository();

export class AdminTutorService implements ITutorAdminService {
  async getAllTutors(
    page: number,
    limit: number,
    status?: string,
    search?: string
  ): Promise<PaginatedTutors> {
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const skip = (page - 1) * limit;

    const tutors = await tutorRepo.getAllWithFilters(query, skip, limit);
    const total = await tutorRepo.countAllWithFilters(query);

    const totalPages = Math.ceil(total / limit);

    return {
      tutors: tutors.map((t) => ({
        _id: t._id,
        name: t.name,
        email: t.email,
        status: t.status,
        assignedCourses: t.assignedCourses
      })),
      total,
      currentPage: page,
      totalPages,
    };
  }

  async getTutorById(id: string): Promise<TutorDetails> {
    const tutor = await tutorRepo.getTutorById(id);
    if (!tutor) throw new Error("Tutor not found");

    return {
      _id: tutor._id,
      name: tutor.name,
      email: tutor.email,
      phone: tutor.phone,
      isGoogleSignup: tutor.isGoogleSignup,
      status: tutor.status,
      verificationDetails: tutor.verificationDetails,
    };
  }

  async updateTutorStatus(
    id: string,
    status: "approved" | "rejected"
  ): Promise<boolean> {
    const allowed = ["approved", "rejected"];
    if (!allowed.includes(status)) throw new Error("Invalid status");
    const result = await tutorRepo.updateTutorStatus(id, status);

    if (!result) throw new Error("Tutor not found");
    return true;
  }

  async assignCourses (tutorId: string, courseIds: string[]): Promise<ITutor | null> {
  return await tutorRepo.assignCoursesToTutor(tutorId, courseIds);
};

}
