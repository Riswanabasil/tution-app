import { ICourseRepository } from "../../../repositories/course/ICourseRepository";
import { ICourse } from "../../../models/course/CourseSchema";
import { TutorRepository } from "../../../repositories/tutor/implementation/TutorRepository";
import { sendCourseStatusEmail } from "../../../utils/SendEmail";

export interface PaginatedCourses {
  courses: ICourse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class AdminCourseService {
  constructor(
    private courseRepo: ICourseRepository,
    private tutorRepo: TutorRepository
  ) {}

  async listPaginated(
    page: number,
    limit: number,
    status?: ICourse["status"],
    search?: string
  ): Promise<PaginatedCourses> {
    const skip = (page - 1) * limit;
    const filter: any = {};
    if (status) filter.status = status;
    if (search) {
      const re = new RegExp(search, "i");
      filter.$or = [{ title: re }, { code: re }, { details: re }];
    }
    const [courses, total] = await Promise.all([
      this.courseRepo.findMany(filter, {
        skip,
        limit,
        sort: { createdAt: -1 },
      }),
      this.courseRepo.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);
    return { courses, total, page, limit, totalPages };
  }

  async updateStatus(id: string, status: ICourse["status"]): Promise<ICourse> {
    const updated = await this.courseRepo.update(id, { status });
    if (!updated) {
      throw new Error("Course not found");
    }

    const tutor = await this.tutorRepo.findById(updated!.tutor.toString());
    if (tutor?.email) {
      await sendCourseStatusEmail(tutor!.email, updated!.title, status);
    }
    return updated;
  }
}
