export interface IAssignment {
  title: string;
  description: string;
  dueDate: string;
}

export interface Assignment {
  _id: string;
  title: string;
  dueDate: string;
  description: string;
  status: 'not submitted' | 'pending' | 'verified' | 'expired';
}
