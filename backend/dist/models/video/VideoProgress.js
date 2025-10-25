"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RangeSchema = new mongoose_1.Schema({ startSec: { type: Number, required: true }, endSec: { type: Number, required: true } }, { _id: false });
const VideoProgressSchema = new mongoose_1.Schema({
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Student', required: true },
    video: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Video', required: true },
    lastPositionSec: { type: Number, default: 0 },
    durationSecSnapshot: { type: Number },
    ranges: { type: [RangeSchema], default: [] },
    totalWatchedSec: { type: Number, default: 0 },
    percent: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
}, { timestamps: true });
VideoProgressSchema.index({ student: 1, video: 1 }, { unique: true });
exports.default = (0, mongoose_1.model)('VideoProgress', VideoProgressSchema);
