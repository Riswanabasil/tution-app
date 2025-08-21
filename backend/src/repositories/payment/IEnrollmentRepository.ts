import { IEnrollment } from "../../models/payment/Enrollment";
export type TimeGranularity = "daily" | "monthly";
export interface DateRange { from: Date; to: Date; }

export interface IEnrollmentRepository{
    create(data: Partial<IEnrollment>):Promise<IEnrollment>
    updateStatus(orderId: string, status: IEnrollment["status"]): Promise<IEnrollment | null>
    updateById(id: string, status: IEnrollment["status"]):Promise<IEnrollment | null>
    findPaidByUser(userId: string): Promise<IEnrollment[]>
    countPaidByUser(userId: string): Promise<number>;

  findPaidByUser(
    userId: string
  ): Promise<(IEnrollment & { courseId: any })[]>;
   countDistinctPaidUsersInRange(range: DateRange): Promise<number>;
  sumPaidAmountInRange(range: DateRange): Promise<number>;
  sumPaidAmountToday(now?: Date): Promise<number>;
  sumPaidAmountMonthToDate(now?: Date): Promise<number>;
  countFailedLast24h(now?: Date): Promise<number>;

  revenueSeries(range: DateRange, by: TimeGranularity): Promise<Array<{ period: string; value: number }>>;
  enrollmentSeries(range: DateRange, by: TimeGranularity): Promise<Array<{ period: string; value: number }>>;
  topCoursesByPaid(range: DateRange, limit: number): Promise<Array<{ courseId: string; enrollments: number; revenue: number }>>;
}