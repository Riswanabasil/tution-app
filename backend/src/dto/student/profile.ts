export interface ProfileDTO {
  _id: string;
  name: string;
  email: string;
  phone?: string | null;
  profilePic?: string | null;
  profilePicKey?: string | null;
  isBlocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
