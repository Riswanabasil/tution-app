import mongoose, { Schema, model, Types } from 'mongoose';

export interface IVideo {
  _id: Types.ObjectId;
  tutor: Types.ObjectId;
  topic: Types.ObjectId;
  title: string;
  description?: string;
  durationSec: number;
  s3Key: string;
  contentType: string;
  url: string;
  isDeleted: boolean;
  createdAt?: Date;
}

const VideoSchema = new Schema<IVideo>(
  {
    tutor: { type: Schema.Types.ObjectId, ref: 'Tutor', required: true },
    topic: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
    title: { type: String, required: true },
    description: { type: String },
    durationSec: { type: Number, required: true },
    s3Key: { type: String, required: true, unique: true },
    contentType: { type: String, required: true },
    url: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Video = mongoose.model<IVideo>('Video', VideoSchema);
export default Video;
