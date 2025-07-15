export interface Topic {
  _id: string;
  moduleId: string;
  title: string;
  description?: string;
  order: number;
  videoUrl?: string;
  noteId?: string;
  liveSessionId?: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}