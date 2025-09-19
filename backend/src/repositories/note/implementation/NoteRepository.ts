import { INote, NoteModel } from '../../../models/note/NoteSchema';
import { INoteRepository } from '../INoteRepository';

export class NoteRepository implements INoteRepository {
  create(data: Partial<INote>) {
    return NoteModel.create(data);
  }

  findByTopic(topicId: string) {
    return NoteModel.find({ topicId, isDeleted: false })
      .select('_id topicId pdfKey uploadedAt')
      .lean()
      .exec();
  }

  findById(id: string) {
    return NoteModel.findById({ _id: id, isDeleted: false }).exec();
  }

  update(id: string, data: Partial<INote>) {
    return NoteModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  delete(id: string) {
    return NoteModel.findByIdAndDelete(id, { isDeleted: true }).exec();
  }
}
