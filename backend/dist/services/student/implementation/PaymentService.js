"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const mongoose_1 = require("mongoose");
const razorpay_1 = require("../../../config/razorpay");
const s3Presign_1 = require("../../../utils/s3Presign");
class PaymentService {
    constructor(repo, tutorRepo, courseRepo) {
        this.repo = repo;
        this.tutorRepo = tutorRepo;
        this.courseRepo = courseRepo;
    }
    createOrder(userId, courseId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const uId = new mongoose_1.Types.ObjectId(userId);
            const cId = new mongoose_1.Types.ObjectId(courseId);
            if (yield this.repo.isPurchased(uId, cId)) {
                // use your AppError util if you have one
                const err = new Error('You already own this course');
                err.status = 409; // Conflict
                throw err;
            }
            const options = {
                amount: amount * 100,
                currency: 'INR',
                receipt: `rcpt_${courseId.substring(0, 10)}_${Date.now()}`,
            };
            const order = yield new Promise((resolve, reject) => {
                razorpay_1.razorpay.orders.create(options, (err, o) => {
                    if (err)
                        return reject(err);
                    resolve(o);
                });
            });
            // const enrollment = await this.repo.create({
            //   userId: new Types.ObjectId(userId),
            //   courseId: new Types.ObjectId(courseId),
            //   razorpayOrderId: order.id,
            //   amount,
            //   status: 'pending',
            // } as Partial<IEnrollment>);
            const enrollment = yield this.repo.upsertPending(new mongoose_1.Types.ObjectId(userId), new mongoose_1.Types.ObjectId(courseId), amount, order.id);
            return {
                razorpayOrderId: order.id,
                amount: order.amount,
                currency: order.currency,
                enrollmentId: enrollment._id.toString(),
            };
        });
    }
    verifyAndUpdate(paymentId, orderId, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            const crypto = yield Promise.resolve().then(() => __importStar(require('crypto')));
            const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
            shasum.update(`${orderId}|${paymentId}`);
            if (shasum.digest('hex') !== signature) {
                throw new Error('Invalid signature');
            }
            const enrollment = yield this.repo.updateStatus(orderId, 'paid');
            if (!enrollment)
                throw new Error('Enrollment not found');
            let courseId;
            if (enrollment.courseId instanceof mongoose_1.Types.ObjectId) {
                courseId = enrollment.courseId.toHexString();
            }
            else {
                courseId = enrollment.courseId._id.toString();
            }
            const course = yield this.courseRepo.findById(courseId);
            if (!course)
                throw new Error('Course not found');
            const payout = Math.round(enrollment.amount * 0.7 * 100) / 100;
            yield this.tutorRepo.incrementWallet(course.tutor.toString(), payout);
        });
    }
    cancelEnrollment(enrollmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repo.updateById(enrollmentId, 'failed');
        });
    }
    // async getMyCourses(userId: string) {
    //   const enrollments = await this.repo.findPaidByUser(userId);
    //   return enrollments.map((e: any) => {
    //     const c = e.courseId;
    //     return {
    //       enrollmentId: e._id.toString(),
    //       course: {
    //         _id: c._id.toString(),
    //         title: c.title,
    //         thumbnail: c.thumbnail,
    //         price: c.price,
    //       },
    //       enrolledAt: e.createdAt,
    //     };
    //   });
    // }
    getMyCourses(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const enrollments = yield this.repo.findPaidByUser(userId);
            return Promise.all(enrollments.map((e) => __awaiter(this, void 0, void 0, function* () {
                const c = e.courseId;
                const key = c.thumbnailKey;
                const signedThumb = yield (0, s3Presign_1.presignGetObject)(key);
                return {
                    enrollmentId: String(e._id),
                    course: {
                        _id: String(c._id),
                        title: c.title,
                        thumbnail: signedThumb,
                        price: c.price,
                    },
                    enrolledAt: e.createdAt,
                };
            })));
        });
    }
    getStats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalEnrolled = yield this.repo.countPaidByUser(userId);
            return { totalEnrolled };
        });
    }
    getPaymentHistory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const enrollments = yield this.repo.findPaymentHistory(userId);
            return enrollments.map((e) => ({
                enrollmentId: e._id,
                courseId: e.courseId._id.toString(),
                title: e.courseId.title,
                thumbnail: e.courseId.thumbnail,
                status: e.status,
                amount: e.amount,
                paidAt: e.createdAt.toISOString(),
            }));
        });
    }
    retryOrder(enrollmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const old = yield this.repo.findById(enrollmentId);
            console.log(old);
            if (!old)
                throw new Error('Enrollment not found');
            if (old.status !== 'failed') {
                throw new Error('Can only retry failed payments');
            }
            const options = {
                amount: old.amount * 100,
                currency: 'INR',
                receipt: `retry_${enrollmentId.substring(0, 10)}_${Date.now()}`,
            };
            const order = yield new Promise((resolve, reject) => {
                razorpay_1.razorpay.orders.create(options, (err, o) => {
                    if (err)
                        return reject(err);
                    resolve(o);
                });
            });
            yield this.repo.update(enrollmentId, {
                razorpayOrderId: order.id,
                status: 'pending',
            });
            return {
                razorpayOrderId: order.id,
                currency: order.currency,
                enrollmentId,
            };
        });
    }
}
exports.PaymentService = PaymentService;
