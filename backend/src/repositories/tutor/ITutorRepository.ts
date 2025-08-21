import { ITutor } from "../../models/tutor/TutorSchema";
export type TutorStatus = "pending" | "verification-submitted" | "approved" | "rejected";
export type TutorQueueItem = {
  _id: string;
  name: string;
  email: string;
  status: TutorStatus;
  createdAt: Date;
};

export interface ITutorRepository {
  create(student: Partial<ITutor>): Promise<ITutor>;
  findByEmail(email: string): Promise<ITutor | null>;
  updateVerificationById(
    tutorId: string,
    verificationDetails: {
      summary: string;
      education: string;
      experience: string;
      idProof: string;
      resume: string;
    }
  ): Promise<ITutor | null>;
  getAllWithFilters(query: any, skip: number, limit: number): Promise<ITutor[]>;
  countAllWithFilters(query: any): Promise<number>;
  getTutorById(id: string): Promise<ITutor | null>;
  updateTutorStatus(
    id: string,
    status: "approved" | "rejected"
  ): Promise<Boolean>;

  updateById(
    id: string,
    updates: Partial<ITutor>
  ): Promise<Omit<ITutor, "password"> | null>;

  countCoursesByTutor(tutorId: string): Promise<number>;

  countStudentsByTutor(tutorId: string): Promise<number>;

  findCoursesByTutor(
    tutorId: string
  ): Promise<
    { _id: string; title: string; status: string; studentCount: number }[]
  >;

  incrementWallet(tutorId: string, amount: number): Promise<void>;
  countByStatusMap(): Promise<Record<TutorStatus, number>>;
  findByIds(ids: string[]): Promise<Array<Pick<ITutor, "_id" | "name" | "email">>>;
  listByStatuses(
    statuses: Array<"pending" | "verification-submitted">,
    limit: number
  ): Promise<TutorQueueItem[]>;
  findByIds(ids: string[]): Promise<Array<Pick<TutorQueueItem, "_id" | "name" | "email">>>;
}
