import { EnrollmentModel, IEnrollment } from "../../../models/payment/Enrollment";
import { IEnrollmentRepository } from "../IEnrollmentRepository";

export class EnrollmentRepository implements IEnrollmentRepository {
  async create(data: Partial<IEnrollment>) {
    return EnrollmentModel.create(data);
  }
  async updateStatus(
    orderId: string,
    status: IEnrollment["status"]
  ): Promise<IEnrollment | null> {
    return EnrollmentModel.findOneAndUpdate(
      { razorpayOrderId: orderId },
      { status },
      { new: true }
    );
  }

   async updateById(id: string, status: IEnrollment["status"]) {
    return EnrollmentModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  async findPaidByUser(userId: string): Promise<(IEnrollment & { course: any })[]> {
    return EnrollmentModel.find({ userId: userId, status: "paid" })
      .populate<{ course: any }>("courseId","title thumbnail price")  
      .exec();
  }
}