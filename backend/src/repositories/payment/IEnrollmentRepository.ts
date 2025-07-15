import { IEnrollment } from "../../models/payment/Enrollment";

export interface IEnrollmentRepository{
    create(data: Partial<IEnrollment>):Promise<IEnrollment>
    updateStatus(orderId: string, status: IEnrollment["status"]): Promise<IEnrollment | null>
    updateById(id: string, status: IEnrollment["status"]):Promise<IEnrollment | null>
    findPaidByUser(userId: string): Promise<IEnrollment[]>
}