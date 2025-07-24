export interface Topic {
  _id: string;
  moduleId: string;
  title: string;
  description?: string;
  order: number;
  isDeleted: boolean
  createdAt: string;
  updatedAt: string;
}


export interface TopicPayload {
  moduleId: string;
  title: string;
  description?: string;
  order: number;
}

export interface TopicForm {
  title: string;
  description?: string;
  order: number;
}
