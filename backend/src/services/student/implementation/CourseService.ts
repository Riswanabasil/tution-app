import { ICourseRepository, IPaginateOptions } from "../../../repositories/course/ICourseRepository";
import { IModuleRepository } from "../../../repositories/module/IModuleRepository";
import { ITutorRepository } from "../../../repositories/tutor/ITutorRepository";
import { CourseDetails } from "../../../types/course";
import { ICourseService, PaginatedCourses } from "../ICourseService";

export class StudentCourseService implements ICourseService{
    constructor(private courseRepo: ICourseRepository,
      private moduleRepo:IModuleRepository,
      private tutorRepo: ITutorRepository
    ) {}

    async listApproved(
    page: number,
    limit: number,
    search: string = ""
  ): Promise<PaginatedCourses> {
    const skip = (page - 1) * limit;
    const filter: any = { status:'approved' };
    if (search) {
      const re = new RegExp(search, "i");
      filter.$or = [
        { title: re },
        { code: re },
        { details: re },
      ];
    }

    const total   = await this.courseRepo.countDocuments(filter);
    const courses = await this.courseRepo.findMany(filter, { skip, limit, sort: { createdAt: -1 } });

    return {
      courses,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async fetchCourseWithModules(courseId: string): Promise<CourseDetails> {
    const course = await this.courseRepo.findById(courseId)
    if (!course) throw new Error('Course not found')

    const modules = await this.moduleRepo.findByCourse(courseId)
    const tutor   = await this.tutorRepo.getTutorById(course.tutor.toString())
    if (!tutor) throw new Error('Tutor not found')

    return {
      _id:          course._id.toString(),
      title:        course.title,
      code:         course.code,
      semester:     course.semester,
      thumbnail:    course.thumbnail,
      demoVideoUrl: course.demoVideoUrl,
      price:        course.price,
      offer:        course.offer,
      actualPrice:  course.actualPrice,
      details:      course.details,
      tutorName:    tutor.name,
      modules:      modules.map(m => ({
        _id:   m._id.toString(),
        name:  m.name,
        order: m.order,
      })),
    }
  }
   
}