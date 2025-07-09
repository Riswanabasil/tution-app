
import { ICourse } from "../../models/course/CourseSchema";

export interface IPaginateOptions {
  skip: number;
  limit: number;
  sort?: Record<string, 1 | -1>;
}

export interface ICourseRepository {
  create(data: Partial<ICourse>): Promise<ICourse>;
  findById(id: string): Promise<ICourse | null>;
  findMany(
    filter: any,
    options: IPaginateOptions
  ): Promise<ICourse[]>;
  countDocuments(filter: any): Promise<number>;
  update(id: string, data: Partial<ICourse>): Promise<ICourse | null>;
  // delete(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
}
