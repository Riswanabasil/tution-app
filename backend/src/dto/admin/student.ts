export interface StudentDTO {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}