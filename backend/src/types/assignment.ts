export type AssignmentId = string;

export interface Assignment {
  _id: AssignmentId;
  topicId: string;
  courseId: string;
  title: string;
  description?: string;
  dueDate?: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
