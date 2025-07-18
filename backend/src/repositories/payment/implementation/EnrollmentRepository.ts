import { EnrollmentModel, IEnrollment } from "../../../models/payment/Enrollment";
import { BaseRepository } from "../../base/BaseRepository";
import { IEnrollmentRepository } from "../IEnrollmentRepository";

export class EnrollmentRepository extends BaseRepository<IEnrollment> implements IEnrollmentRepository {
   constructor() {
      super(EnrollmentModel);
    }
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

  async findByOrderId(id: string): Promise<IEnrollment | null> {
    return EnrollmentModel.findOne({ razorpayOrderId:id});
  }

   async updateById(id: string, status: IEnrollment["status"]) {
    return EnrollmentModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  async findPaidByUser(userId: string): Promise<(IEnrollment & { course: any })[]> {
    return EnrollmentModel.find({ userId: userId ,status:"paid"}).sort({createdAt:-1})
      .populate<{ course: any }>("courseId","title thumbnail price")  
      .exec();
  }
  async findPaymentHistory(userId: string): Promise<(IEnrollment & { course: any })[]> {
    return EnrollmentModel.find({ userId: userId ,}).sort({createdAt:-1})
      .populate<{ course: any }>("courseId","title thumbnail price")  
      .exec();
  }

   async countPaidByUser(userId: string): Promise<number> {
    return EnrollmentModel
      .countDocuments({ userId, status: "paid" })
      .exec();
  }

  
}