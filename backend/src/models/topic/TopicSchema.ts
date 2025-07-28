import mongoose, { Schema, Document } from 'mongoose';

export interface ITopic extends Document {
  _id:string
  title: string;
  description: string;
  moduleId: mongoose.Types.ObjectId;
  order: number;
  isDeleted:boolean
  createdAt?: Date;
  updatedAt?: Date;
}

const TopicSchema = new Schema<ITopic>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    moduleId: { type: Schema.Types.ObjectId, required: true, ref: 'Module' },
    order: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
)
export const TopicModel = mongoose.model<ITopic>('Topic', TopicSchema);
