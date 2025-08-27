import { NoteRepository } from '../../../repositories/note/implementation/NoteRepository';
import { INote } from '../../../models/note/NoteSchema';

export class NoteService {
  constructor(private readonly repo: NoteRepository) {}

  create(data: Partial<INote>) {
    return this.repo.create(data);
  }

  getByTopic(topicId: string) {
    return this.repo.findByTopic(topicId);
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
