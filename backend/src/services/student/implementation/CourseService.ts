import { TutorProfileDTO } from '../../../dto/student/TutorProfileDTO';
import { mapTutorToProfileDTO } from '../../../mappers/student/tutorMapper';
import { ICourseRepository } from '../../../repositories/course/ICourseRepository';
import { IModuleRepository } from '../../../repositories/module/IModuleRepository';
import { ITopicRepository } from '../../../repositories/topic/ITopicRepository';
import { ITutorRepository } from '../../../repositories/tutor/ITutorRepository';
import { CourseDetails } from '../../../types/course';
import { presignGetObject } from '../../../utils/s3Presign';
import { ICourseService, PaginatedCourses } from '../ICourseService';

export class StudentCourseService implements ICourseService {
  constructor(
    private courseRepo: ICourseRepository,
    private moduleRepo: IModuleRepository,
    private tutorRepo: ITutorRepository,
    private topicRepo: ITopicRepository,
  ) {}

  async listApproved(
    page: number,
    limit: number,
    search: string = '',
    semester?: number,
    sortBy?: string,
  ): Promise<PaginatedCourses> {
    const skip = (page - 1) * limit;
    const filter: any = { status: 'approved', deletedAt: { $exists: false } };
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

    const raw = await this.courseRepo.findMany(filter, { skip, limit, sort });

    const courses = await Promise.all(
      raw.map(async (c: any) => {
        const obj = c.toObject ? c.toObject() : c;
        obj.thumbnail = obj.thumbnailKey ? await presignGetObject(obj.thumbnailKey) : undefined;
        return obj;
      }),
    );
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
    const obj = course.toObject ? course.toObject() : course;
    const thumbnail = obj.thumbnailKey
      ? await presignGetObject(obj.thumbnailKey, { expiresIn: 600 })
      : undefined;
    const demoVideoUrl = obj.demoKey
      ? await presignGetObject(obj.demoKey, { expiresIn: 600 })
      : undefined;

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
      _id: obj._id.toString(),
      title: obj.title,
      code: obj.code,
      semester: obj.semester,
      thumbnail,
      demoVideoUrl,
      price: obj.price,
      offer: obj.offer,
      actualPrice: obj.actualPrice,
      details: obj.details,
      tutorName: tutor.name,
      tutorProfilePic: tutor.profilePic,
      tutorEducation: tutor.verificationDetails?.education || '',
      tutorExperience: tutor.verificationDetails?.experience || '',
      tutorSummary: tutor.verificationDetails?.summary || '',
      modules: enrichedModules,
    };
  }

  async getTutorProfileByCourseId(courseId: string): Promise<TutorProfileDTO | null> {
    // 1. find course
    const course = await this.courseRepo.findById(courseId);
    if (!course) return null;

    const tutorId = course.tutor;
    if (!tutorId) return null;

    // 2. find tutor by id
    const tutor = await this.tutorRepo.getTutorById(tutorId.toString());
    if (!tutor) return null;

    // 3. map
    return mapTutorToProfileDTO(tutor);
  }
}
