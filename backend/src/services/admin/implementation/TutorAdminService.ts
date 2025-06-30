import { ITutorAdminService, PagedTutors, TutorDetails } from "../ITutorAdminService";
import { ITutorRepository } from "../../../repositories/tutor/ITutorRepository";
import { ITutor } from "../../../models/tutor/TutorSchema";

export class TutorAdminService implements ITutorAdminService {
  constructor(private tutorRepo: ITutorRepository) {}

  async getAllTutors(
    page: number,
    limit: number,
    status?: string,
    search?: string
  ): Promise<PagedTutors> {
    const skip = (page - 1) * limit;
    const query: any = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await this.tutorRepo.countAllWithFilters(query);
    const tutorsRaw: ITutor[] = await this.tutorRepo.getAllWithFilters(query, skip, limit);

    const tutors = tutorsRaw.map(t => ({
      _id: t._id.toString(),
      id: t._id.toString(),
      name: t.name,
      email: t.email,
      status: t.status,
      assignedCourses: t.assignedCourses.map(id => id.toString())
    }));

    return {
      tutors,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getTutorById(id: string): Promise<TutorDetails> {
    const t = await this.tutorRepo.getTutorById(id);
    if (!t) throw new Error('Tutor not found');

    return {
      id: t._id.toString(),
      name: t.name,
      email: t.email,
      phone: t.phone,
      isGoogleSignup: t.isGoogleSignup,
      status: t.status,
      assignedCourses: t.assignedCourses.map(id => id.toString()),
      verificationDetails: t.verificationDetails
    };
  }

  async updateTutorStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
    const allowed = ['approved', 'rejected'];
    if (!allowed.includes(status)) throw new Error('Invalid status');

    const success = await this.tutorRepo.updateTutorStatus(id, status);
    if (!success) throw new Error('Tutor not found');
  }
}

