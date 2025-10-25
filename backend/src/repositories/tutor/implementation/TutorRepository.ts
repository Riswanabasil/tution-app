import Tutor, { ITutor } from '../../../models/tutor/TutorSchema';
import { Course, ICourse } from '../../../models/course/CourseSchema';
import { ITutorRepository, TutorQueueItem } from '../ITutorRepository';
import { BaseRepository } from '../../base/BaseRepository';
import { EnrollmentModel } from '../../../models/payment/Enrollment';

export class TutorRepository extends BaseRepository<ITutor> implements ITutorRepository {
  constructor() {
    super(Tutor);
  }

  async findByEmail(email: string): Promise<ITutor | null> {
    return Tutor.findOne({ email });
  }
  async updateVerificationById(
    tutorId: string,
    verificationDetails: {
      summary: string;
      education: string;
      experience: string;
      idProof: string;
      resume: string;
    },
  ): Promise<ITutor | null> {
    return Tutor.findByIdAndUpdate(
      tutorId,
      {
        status: 'verification-submitted',
        verificationDetails,
      },
      { new: true },
    );
  }
  async getAllWithFilters(query: any, skip: number, limit: number): Promise<ITutor[]> {
    return Tutor.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    // .populate("assignedCourses", "title");
  }

  async countAllWithFilters(query: any): Promise<number> {
    return Tutor.countDocuments(query);
  }

  // async getTutorById(id: string): Promise<ITutor | null> {
  //   return Tutor.findById(id);
  // }

  async getTutorById(id: string) {
    return Tutor.findById(id)
      .select(
        'name email phone isGoogleSignup status verificationDetails password profilePic walletBalance',
      )
      .lean()
      .exec();
  }
  async updateTutorStatus(id: string, status: 'approved' | 'rejected'): Promise<Boolean> {
    const updated = await Tutor.findByIdAndUpdate(id, { status });
    return !!updated;
  }

  async updateById(id: string, updates: any) {
    return Tutor.findByIdAndUpdate(id, updates, { new: true }).select('-password').lean().exec();
  }

  async countCoursesByTutor(tutorId: string) {
    return Course.countDocuments({ tutor: tutorId }).exec();
  }

  async countStudentsByTutor(tutorId: string) {
    const courses = await Course.find({ tutor: tutorId }).select('_id').lean();
    const ids = courses.map((c) => c._id);
    return EnrollmentModel.countDocuments({
      courseId: { $in: ids },
      status: 'paid',
    }).exec();
  }

  async findCoursesByTutor(tutorId: string) {
    const courses = await Course.find({ tutor: tutorId }).select('title status').lean();

    //  aggregate
    return Promise.all(
      courses.map(async (c) => {
        const studentCount = await EnrollmentModel.countDocuments({
          courseId: c._id,
          status: 'paid',
        }).exec();
        return {
          _id: c._id.toString(),
          title: c.title,
          status: c.status,
          studentCount,
        };
      }),
    );
  }
  async incrementWallet(tutorId: string, amount: number): Promise<void> {
    await Tutor.findByIdAndUpdate(
      tutorId,
      { $inc: { walletBalance: amount } },
      { new: true },
    ).exec();
  }
  async countByStatusMap(): Promise<
    Record<'pending' | 'verification-submitted' | 'approved' | 'rejected', number>
  > {
    const rows = await (await import('../../../models/tutor/TutorSchema')).default
      .aggregate<{ _id: string; n: number }>([{ $group: { _id: '$status', n: { $sum: 1 } } }])
      .exec();
    return {
      pending: rows.find((r) => r._id === 'pending')?.n ?? 0,
      'verification-submitted': rows.find((r) => r._id === 'verification-submitted')?.n ?? 0,
      approved: rows.find((r) => r._id === 'approved')?.n ?? 0,
      rejected: rows.find((r) => r._id === 'rejected')?.n ?? 0,
    };
  }

  async findByIds(ids: string[]) {
    return Tutor.find({ _id: { $in: ids } })
      .select('_id name email')
      .lean()
      .exec();
  }

  async listByStatuses(
    statuses: Array<'pending' | 'verification-submitted'>,
    limit: number,
  ): Promise<TutorQueueItem[]> {
    const docs = await Tutor.find({ status: { $in: statuses } })
      .select('_id name email status createdAt')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();

    return docs.map((d: any) => ({
      _id: String(d._id),
      name: d.name,
      email: d.email,
      status: d.status,
      createdAt: d.createdAt,
    }));
  }
  async getWalletBalance(tutorId: string): Promise<number> {
    const doc = await Tutor.findById(tutorId).select('walletBalance').lean().exec();
    return doc?.walletBalance ?? 0;
  }
}
