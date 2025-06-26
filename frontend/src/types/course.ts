

export interface ICourse {
  _id: string;
  title: string;
  code: string;
  semester: number;
  thumbnail?: string;
  price: number;
  offer?: number;
  actualPrice?: number;
  details?: string;
  createdAt?: string;
  updatedAt?: string;
}
