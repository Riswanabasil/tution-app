import { useEffect, useState } from 'react';
import {
  getNoteUploadUrls,
  createNote,
  fetchNotesByTopic,
  updateNote,
  deleteNote,
} from '../../services/NoteApi';
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import Swal from 'sweetalert2';

type Prisigned = {
  pdfUrl: string;
  key: string;
};

type Note = {
  _id: string;
  pdfUrls: string[];
  uploadedAt: string;
};

type NotesTabProps = {
  topicId: string;
};

// limits (tweak as you like)
const MAX_FILES = 10;
const MAX_FILE_SIZE_MB = 10;
const BYTES_PER_MB = 1024 * 1024;

function validatePdfFiles(list: FileList | null) {
  const errors: string[] = [];
  if (!list || list.length === 0) {
    errors.push('Please select at least one PDF.');
    return { ok: false, errors };
  }

  if (list.length > MAX_FILES) {
    errors.push(`You can upload up to ${MAX_FILES} PDFs at once.`);
  }

  for (const f of Array.from(list)) {
    const isPdf = f.type === 'application/pdf' || /\.pdf$/i.test(f.name);
    if (!isPdf) errors.push(`"${f.name}" is not a PDF.`);
    if (f.size > MAX_FILE_SIZE_MB * BYTES_PER_MB) {
      errors.push(`"${f.name}" exceeds ${MAX_FILE_SIZE_MB} MB.`);
    }
  }

  return { ok: errors.length === 0, errors };
}


export default function NotesTab({ topicId }: NotesTabProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [open, setOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const loadNotes = async () => {
    if (!topicId) return;
    const data = await fetchNotesByTopic(topicId);
    setNotes(data);
  };

  useEffect(() => {
    loadNotes();
  }, [topicId]);

  // const handleAddEdit = async () => {
  //   if (!files || files.length === 0 || !topicId) return;
  //   try {
  //     setUploading(true);
  //     const { data: presigned } = await getNoteUploadUrls(files.length);
  //     await Promise.all(
  //       Array.from(files).map((file, i) =>
  //         fetch(presigned[i].uploadUrl, {
  //           method: 'PUT',
  //           headers: { 'Content-Type': 'application/pdf' },
  //           body: file,
  //         }),
  //       ),
  //     );
  //     const pdfKeys = presigned.map((item: Prisigned) => item.key);

  //     if (editNote) {
  //       await updateNote(editNote._id, { pdfKeys });
  //       Swal.fire('Updated!', 'Note updated successfully', 'success');
  //     } else {
  //       await createNote(topicId, { pdfKeys });
  //       Swal.fire('Added!', 'Note uploaded successfully', 'success');
  //     }

  //     setOpen(false);
  //     setEditNote(null);
  //     setFiles(null);
  //     loadNotes();
  //   } catch (err) {
  //     console.error(err);
  //     Swal.fire('Error', 'Upload failed', 'error');
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  const handleAddEdit = async () => {
  const res = validatePdfFiles(files);
  if (!res.ok || !topicId) {
    if (!res.ok) Swal.fire('Invalid files', res.errors.join('<br/>'), 'error');
    return;
  }

  try {
    setUploading(true);
    const { data: presigned } = await getNoteUploadUrls(files!.length);

    await Promise.all(
      Array.from(files!).map((file, i) =>
        fetch(presigned[i].uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/pdf' },
          body: file,
        })
      )
    );

    const pdfKeys = presigned.map((item: any) => item.key);
    if (editNote) {
      await updateNote(editNote._id, { pdfKeys });
      Swal.fire('Updated!', 'Note updated successfully', 'success');
    } else {
      await createNote(topicId, { pdfKeys });
      Swal.fire('Added!', 'Note uploaded successfully', 'success');
    }

    setOpen(false);
    setEditNote(null);
    setFiles(null);
    setFileError(null);
    loadNotes();
  } catch (err) {
    console.error(err);
    Swal.fire('Error', 'Upload failed', 'error');
  } finally {
    setUploading(false);
  }
};


  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it',
    });
    if (result.isConfirmed) {
      await deleteNote(id);
      Swal.fire('Deleted!', 'Note has been deleted', 'success');
      loadNotes();
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // const handleDrop = (e: React.DragEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setDragActive(false);

  //   const droppedFiles = e.dataTransfer.files;
  //   if (droppedFiles) {
  //     setFiles(droppedFiles);
  //   }
  // };
const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);

  const droppedFiles = e.dataTransfer.files;
  const res = validatePdfFiles(droppedFiles);
  if (!res.ok) {
    setFiles(null);
    setFileError(res.errors.join('\n'));
    // Swal.fire('Invalid files', res.errors.join('<br/>'), 'error');
  } else {
    setFiles(droppedFiles);
    setFileError(null);
  }
};

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <svg
              className="h-4 w-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Study Notes</h2>
            <p className="text-sm text-slate-500">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'} available
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="group flex transform items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl"
        >
          <svg
            className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Note
        </button>
      </div>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <svg
              className="h-10 w-10 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-800">No notes yet</h3>
          <p className="mx-auto mb-6 max-w-md text-slate-500">
            Upload your first study note to get started. You can add PDF files with course
            materials, handouts, and reference documents.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex transform items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Upload Your First Note
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {notes.map((note, index) => (
            <div
              key={note._id}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md"
            >
              <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100">
                      <svg
                        className="h-5 w-5 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Note #{index + 1}</h3>
                      <p className="text-sm text-slate-500">
                        Uploaded{' '}
                        {new Date(note.uploadedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-60 transition-opacity duration-200 group-hover:opacity-100">
                    <button
                      onClick={() => {
                        setEditNote(note);
                        setOpen(true);
                      }}
                      className="rounded-lg p-2 text-indigo-600 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-700"
                      title="Edit note"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="rounded-lg p-2 text-red-600 transition-all duration-200 hover:bg-red-50 hover:text-red-700"
                      title="Delete note"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* PDF Files List */}
                <div className="space-y-2">
                  {note.pdfUrls.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/pdf flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition-all duration-200 hover:border-slate-300 hover:bg-slate-100"
                    >
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-100">
                        <svg
                          className="h-4 w-4 text-red-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-800 group-hover/pdf:text-slate-900">
                          PDF Document {i + 1}
                        </p>
                        <p className="text-sm text-slate-500">Click to view in new tab</p>
                      </div>
                      <svg
                        className="h-4 w-4 text-slate-400 transition-colors duration-200 group-hover/pdf:text-slate-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Dialog */}
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEditNote(null);
          setFiles(null);
        }}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          style: {
            borderRadius: '16px',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {editNote ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                )}
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-800">
              {editNote ? 'Edit Note' : 'Add New Note'}
            </span>
          </div>
        </DialogTitle>

        <DialogContent className="p-6">
          {/* File Upload Area */}
          <div
            className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
              dragActive
                ? 'border-indigo-400 bg-indigo-50'
                : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {/* <input
              type="file"
              multiple
              accept=".pdf"
              onChange={(e) => setFiles(e.target.files)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            /> */}
<input
  type="file"
  multiple
  accept=".pdf"
  onChange={(e) => {
    const res = validatePdfFiles(e.target.files);
    if (!res.ok) {
      setFiles(null);
      setFileError(res.errors.join('\n'));
      // or SweetAlert if you prefer:
      // Swal.fire('Invalid files', res.errors.join('<br/>'), 'error');
    } else {
      setFiles(e.target.files);
      setFileError(null);
    }
  }}
  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
/>
            <div className="space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
                <svg
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>

              <div>
                <p className="mb-1 text-lg font-semibold text-slate-800">
                  Drop PDF files here or click to browse
                </p>
                <p className="text-sm text-slate-500">Select multiple PDF files to upload</p>
              </div>
            </div>
          </div>

          {/* Selected Files Preview */}
          {files && files.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-semibold text-slate-800">Selected Files:</h4>
              <div className="space-y-2">
                {Array.from(files).map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-100">
                      <svg className="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-800">{file.name}</p>
                      <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-3">
            <Button
              variant="outlined"
              onClick={() => {
                setEditNote(null);
                setFiles(null);
                setOpen(false);
              }}
              className="px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddEdit}
              disabled={uploading || !files || files.length === 0}
              className="px-6 py-2"
              style={{
                background: uploading
                  ? '#94a3b8'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: uploading ? 'none' : '0 4px 14px 0 rgba(16, 185, 129, 0.3)',
              }}
            >
              {uploading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Uploading...
                </div>
              ) : editNote ? (
                'Update Note'
              ) : (
                'Upload Note'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
