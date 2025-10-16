"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentModel = void 0;
const mongoose_1 = require("mongoose");
const EnrollmentSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Types.ObjectId, ref: 'Student', required: true },
    courseId: { type: mongoose_1.Types.ObjectId, ref: 'Course', required: true },
    razorpayOrderId: { type: String, required: true, unique: true },
    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    amount: { type: Number, required: true },
}, { timestamps: true });
EnrollmentSchema.index({ status: 1, createdAt: 1 });
EnrollmentSchema.index({ status: 1, courseId: 1, createdAt: 1 });
EnrollmentSchema.index({ status: 1, userId: 1, createdAt: 1 });
EnrollmentSchema.index({ userId: 1, courseId: 1 }, {
    unique: true,
    partialFilterExpression: { status: { $in: ['pending', 'paid'] } },
});
exports.EnrollmentModel = (0, mongoose_1.model)('Enrollment', EnrollmentSchema);
