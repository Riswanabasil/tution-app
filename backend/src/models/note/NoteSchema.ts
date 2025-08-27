import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  topicId: mongoose.Types.ObjectId;
  pdfUrls: string[];
  uploadedAt: Date;
  isDeleted: boolean;
}

const NoteSchema = new Schema<INote>(
  {
    topicId: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
    pdfUrls: { type: [String], required: true },
    uploadedAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const NoteModel = mongoose.model<INote>('Note', NoteSchema);
