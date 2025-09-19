import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  topicId: mongoose.Types.ObjectId;
  pdfKey: string;
  pdfUrls?: string[];
  uploadedAt: Date;
  isDeleted: boolean;
}

const NoteSchema = new Schema<INote>(
  {
    topicId: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
    pdfKey: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const NoteModel = mongoose.model<INote>('Note', NoteSchema);
