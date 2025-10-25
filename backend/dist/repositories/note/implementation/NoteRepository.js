'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.NoteRepository = void 0;
const NoteSchema_1 = require('../../../models/note/NoteSchema');
class NoteRepository {
  create(data) {
    return NoteSchema_1.NoteModel.create(data);
  }
  findByTopic(topicId) {
    return NoteSchema_1.NoteModel.find({ topicId, isDeleted: false })
      .select('_id topicId pdfKey uploadedAt')
      .lean()
      .exec();
  }
  findById(id) {
    return NoteSchema_1.NoteModel.findById({ _id: id, isDeleted: false }).exec();
  }
  update(id, data) {
    return NoteSchema_1.NoteModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }
  delete(id) {
    return NoteSchema_1.NoteModel.findByIdAndDelete(id, { isDeleted: true }).exec();
  }
}
exports.NoteRepository = NoteRepository;
