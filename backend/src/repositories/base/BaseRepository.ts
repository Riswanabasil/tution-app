import { Model, Types } from 'mongoose';
import { IBaseRepository } from './IBaseRepository';

export class BaseRepository<T> implements IBaseRepository<T> {
  private model: Model<any>;
  constructor(model: Model<any>) {
    this.model = model;
  }

  async create(item: Partial<T>): Promise<T> {
    const created = await this.model.create(item);
    return created.toObject();
  }

  async findById(id: Types.ObjectId | string): Promise<T | null> {
    return this.model.findById(id);
  }

  async findAll(): Promise<T[]> {
    return this.model.find();
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);

    return !!result;
  }
}
