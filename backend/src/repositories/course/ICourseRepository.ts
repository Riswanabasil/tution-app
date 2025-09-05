import { Types } from 'mongoose';
import { ICourse } from '../../models/course/CourseSchema';
import {
  CourseListItem,
  CourseStatus,
  IPaginateOptions,
  TutorCourseListItem,
  TutorPendingCourseItem,
} from '../../types/course';

export interface ICourseRepository {
  create(data: Partial<ICourse>): Promise<ICourse>;
  findById(id: Types.ObjectId | string): Promise<ICourse | null>;
  findMany(filter: any, options: IPaginateOptions): Promise<ICourse[]>;
  countDocuments(filter: any): Promise<number>;
  update(id: string, data: Partial<ICourse>): Promise<ICourse | null>;
  softDelete(id: string): Promise<void>;
  countByStatusMap(): Promise<Record<CourseStatus, number>>;
  listByStatus(status: CourseStatus, limit: number): Promise<CourseListItem[]>;
  findByIds(ids: string[]): Promise<Array<ICourse>>;
  countByStatusForTutor(tutorId: string): Promise<Record<CourseStatus, number>>;
  listIdsByTutor(tutorId: string, statuses?: CourseStatus[]): Promise<string[]>;
  listPendingForTutor(tutorId: string, limit: number): Promise<TutorPendingCourseItem[]>;
  listByTutor(
    tutorId: string,
    opts: { status?: CourseStatus; skip?: number; limit?: number },
  ): Promise<TutorCourseListItem[]>;
}
