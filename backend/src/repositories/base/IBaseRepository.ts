import { Types } from 'mongoose';

export interface IBaseRepository<T> {
  create(item: Partial<T>): Promise<T>;
  findById(id: Types.ObjectId | string): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
