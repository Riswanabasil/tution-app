
import { Types } from "mongoose";
import { ICourse } from "../../models/course/CourseSchema";

export interface IPaginateOptions {
  skip: number;
  limit: number;
  sort?: Record<string, 1 | -1>;
}
export type CourseListItem = {
  _id: string;
  title: string;
  code: string;
  semester: number;
  tutor: string;
  status: CourseStatus;
  createdAt: Date;
};
export type CourseStatus = "pending" | "approved" | "rejected";
export interface ICourseRepository {
  create(data: Partial<ICourse>): Promise<ICourse>;
  findById(id:Types.ObjectId | string): Promise<ICourse | null>;
  findMany(
    filter: any,
    options: IPaginateOptions
  ): Promise<ICourse[]>;
  countDocuments(filter: any): Promise<number>;
  update(id: string, data: Partial<ICourse>): Promise<ICourse | null>;
  softDelete(id: string): Promise<void>;
   countByStatusMap(): Promise<Record<CourseStatus, number>>;
  listByStatus(status: CourseStatus, limit: number): Promise<CourseListItem[]>;
  findByIds(ids: string[]): Promise<Array<ICourse>>;
}
