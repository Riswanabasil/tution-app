import {
  ICourseRepository,
} from '../../../repositories/course/ICourseRepository';
import { IModuleRepository } from '../../../repositories/module/IModuleRepository';
import { TopicRepository } from '../../../repositories/topic/implementation/TopicRepository';
import { ITutorRepository } from '../../../repositories/tutor/ITutorRepository';
import { CourseDetails } from '../../../types/course';
import { ICourseService, PaginatedCourses } from '../ICourseService';

export class StudentCourseService implements ICourseService {
  constructor(
    private courseRepo: ICourseRepository,
    private moduleRepo: IModuleRepository,
    private tutorRepo: ITutorRepository,
    private topicRepo: TopicRepository,
  ) {}

  async listApproved(
    page: number,
    limit: number,
    search: string = '',
    semester?: number,
    sortBy?: string,
  ): Promise<PaginatedCourses> {
    const skip = (page - 1) * limit;
    const filter: any = { status: 'approved' };
    if (search) {
      const re = new RegExp(search, 'i');
      filter.$or = [{ title: re }, { code: re }, { details: re }];
    }
    if (semester !== undefined) {
      filter.semester = semester;
    }
    const sort: any = {};

    if (sortBy) {
      const isDescending = sortBy.startsWith('-');
      const field = isDescending ? sortBy.slice(1) : sortBy;
      sort[field] = isDescending ? -1 : 1;
    } else {
      sort['createdAt'] = -1;
    }
    const total = await this.courseRepo.countDocuments(filter);
    const courses = await this.courseRepo.findMany(filter, { skip, limit, sort });
    return {
      courses,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async fetchCourseWithModules(courseId: string): Promise<CourseDetails> {
    const course = await this.courseRepo.findById(courseId);
    if (!course) throw new Error('Course not found');

    const modules = await this.moduleRepo.findByCourse(courseId);
    const tutor = await this.tutorRepo.getTutorById(course.tutor.toString());
    if (!tutor) throw new Error('Tutor not found');

    const enrichedModules = await Promise.all(
      modules.map(async (m) => {
        const topics = await this.topicRepo.findByModule(m._id.toString());
        return {
          _id: m._id.toString(),
          name: m.name,
          order: m.order,
          topics: topics.map((t) => ({
            _id: t._id.toString(),
            title: t.title,
            description: t.description,
            order: t.order,
          })),
        };
      }),
    );

    return {
      _id: course._id.toString(),
      title: course.title,
      code: course.code,
      semester: course.semester,
      thumbnail: course.thumbnail,
      demoVideoUrl: course.demoVideoUrl,
      price: course.price,
      offer: course.offer,
      actualPrice: course.actualPrice,
      details: course.details,
      tutorName: tutor.name,
      tutorProfilePic: tutor.profilePic,
      tutorEducation: tutor.verificationDetails?.education || '',
      tutorExperience: tutor.verificationDetails?.experience || '',
      tutorSummary: tutor.verificationDetails?.summary || '',
      modules: enrichedModules,
    };
  }
}
