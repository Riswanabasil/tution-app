"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toObjectIds = toObjectIds;
exports.matchPaid = matchPaid;
const mongoose_1 = require("mongoose");
function toObjectIds(ids) {
    return ids.map((id) => new mongoose_1.Types.ObjectId(id));
}
function matchPaid(range, courseIds) {
    if (!courseIds.length)
        return { _id: { $exists: false } };
    return {
        status: 'paid',
        courseId: { $in: toObjectIds(courseIds) },
        createdAt: { $gte: range.from, $lte: range.to },
    };
}
