import { NoteRepository } from '../../../repositories/note/implementation/NoteRepository';
import { INote } from '../../../models/note/NoteSchema';
import { INoteService } from '../INoteService';
import { presignGetObject } from '../../../utils/s3Presign';

export class NoteService implements INoteService {
  constructor(private readonly repo: NoteRepository) {}

  create(data: Partial<INote>) {
    return this.repo.create(data);
  }

  // getByTopic(topicId: string) {
  //   return this.repo.findByTopic(topicId);
  // }

  async getByTopic(topicId: string) {
    const notes = await this.repo.findByTopic(topicId);
    return Promise.all(notes.map(async (n) => {
      const url = await presignGetObject(n.pdfKey);     // reuse helper
      return { ...n, pdfUrls: url ? [url] : [] };       // field name matches FE
    }));
  }

  getById(id: string) {
    return this.repo.findById(id);
  }

  update(id: string, data: Partial<INote>) {
    return this.repo.update(id, data);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
