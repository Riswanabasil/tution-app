import { INote } from '../../models/note/NoteSchema';

export interface INoteRepository {
  create(data: Partial<INote>): Promise<INote>;
  findByTopic(topicId: string): Promise<INote[]>;
  findById(id: string): Promise<INote | null>;
  update(id: string, data: Partial<INote>): Promise<INote | null>;
  delete(id: string): Promise<INote | null>;
}
