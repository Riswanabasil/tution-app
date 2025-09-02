import { INote } from "../../models/note/NoteSchema";

export interface INoteService {
  create(data: Partial<INote>): Promise<INote>;
  getByTopic(topicId: string): Promise<INote[]>;
  getById(id: string): Promise<INote | null>;
  update(id: string, data: Partial<INote>): Promise<INote | null>;
  delete(id: string): Promise<INote | null>; 
}
