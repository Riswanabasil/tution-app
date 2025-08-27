import { ITopic, TopicModel } from '../../../models/topic/TopicSchema';

export class TopicRepository {
  async create(data: Partial<ITopic>): Promise<ITopic> {
    return await TopicModel.create(data);
  }

  async findByModule(moduleId: string): Promise<ITopic[]> {
    return await TopicModel.find({ moduleId, isDeleted: false }).sort({ order: 1 }).exec();
  }

  async findWithFilter(filter: any, page: number, limit: number) {
    const total = await TopicModel.countDocuments(filter);
    const topics = await TopicModel.find(filter)
      .sort({ order: 1 })
      .skip((page - 1) * limit)
      .limit(limit);
    return { topics, total };
  }

  async findById(id: string): Promise<ITopic | null> {
    return await TopicModel.findOne({ _id: id, isDeleted: false }).exec();
  }

  async update(id: string, data: Partial<ITopic>): Promise<ITopic | null> {
    return await TopicModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await TopicModel.findByIdAndUpdate(id, { isDeleted: true }).exec();
  }
}
