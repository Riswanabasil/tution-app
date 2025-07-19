import mongoose, { Schema, Document } from 'mongoose';

export interface ITopic extends Document {
  title: string;
  description: string;
  moduleId: mongoose.Types.ObjectId;
  noteId?: mongoose.Types.ObjectId;
  liveSessionId?: mongoose.Types.ObjectId;
  videoUrl?: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const TopicSchema = new Schema<ITopic>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    moduleId: { type: Schema.Types.ObjectId, required: true, ref: 'Module' },
    noteId: { type: Schema.Types.ObjectId, ref: 'Note' },
    liveSessionId: { type: Schema.Types.ObjectId, ref: 'LiveSession' },
    videoUrl: { type: String },
    order: { type: Number, required: true }
  },
  { timestamps: true }
);

export const TopicModel = mongoose.model<ITopic>('Topic', TopicSchema);
