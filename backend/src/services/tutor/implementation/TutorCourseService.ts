import { ITutorCourseService, PaginatedCourses } from "../ITutorCourseService";
import { ICourseRepository } from "../../../repositories/course/ICourseRepository";
import { ICourse } from "../../../models/course/CourseSchema";

export class TutorCourseService implements ITutorCourseService {
  constructor(private courseRepo: ICourseRepository) {}

  async createCourse(data: Partial<ICourse>): Promise<ICourse> {
    console.log(data);
    
    return this.courseRepo.create(data);
  }

  async getAllCourses(
     tutorId: string,
    page: number,
    limit: number,
    search: string = ""
  ): Promise<PaginatedCourses> {
    const skip = (page - 1) * limit;

    const filter: any = { tutor: tutorId,deletedAt: { $exists: false } };

    if (search) {
      const re = new RegExp(search, "i");
      filter.$or = [
        { title:  re },
        { code:   re },
        { details: re }
      ];
    }
    const total = await this.courseRepo.countDocuments(filter);
    const courses = await this.courseRepo.findMany(filter, { skip, limit, sort: { createdAt: -1 } });

    return {
      courses,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCourseById(id: string): Promise<ICourse | null> {
    return this.courseRepo.findById(id);
  }

  async updateCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null> {
    return this.courseRepo.update(id, data);
  }

   async softDeleteCourse(id: string): Promise<void> {
  return this.courseRepo.softDelete(id);
}

}
