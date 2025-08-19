import { Schema, model, Types } from "mongoose";

export interface IWatchedRange { startSec: number; endSec: number; }

export interface IVideoProgress {
  _id: Types.ObjectId;
  student: Types.ObjectId;
  video: Types.ObjectId;
  lastPositionSec: number;
  durationSecSnapshot?: number;
  ranges: IWatchedRange[];
  totalWatchedSec: number;
  percent: number;           
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RangeSchema = new Schema<IWatchedRange>(
  { startSec: { type: Number, required: true }, endSec: { type: Number, required: true } },
  { _id: false }
);

const VideoProgressSchema = new Schema<IVideoProgress>(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    video:   { type: Schema.Types.ObjectId, ref: "Video",   required: true },
    lastPositionSec: { type: Number, default: 0 },
    durationSecSnapshot: { type: Number },
    ranges: { type: [RangeSchema], default: [] },
    totalWatchedSec: { type: Number, default: 0 },
    percent: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

VideoProgressSchema.index({ student: 1, video: 1 }, { unique: true });

export default model<IVideoProgress>("VideoProgress", VideoProgressSchema);
