import { useEffect, useState } from "react";
import { getNoteUploadUrls, createNote, fetchNotesByTopic, updateNote, deleteNote } from "../../services/NoteApi";

import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import Swal from "sweetalert2";
type Prisigned={
    pdfUrl:string
    key:string
}
type Note = {
  _id: string;
  pdfUrls: string[];
  uploadedAt: string;
};
type NotesTabProps = {
  topicId: string;
};
export default function NotesTab({ topicId }: NotesTabProps) {
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [open, setOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadNotes = async () => {
    if (!topicId) return;
    const data = await fetchNotesByTopic(topicId);
    setNotes(data);
  };

  useEffect(() => {
    loadNotes();
  }, [topicId]);

  const handleAddEdit = async () => {
    if (!files || files.length === 0 || !topicId) return;
    try {
      setUploading(true);
      const { data: presigned } = await getNoteUploadUrls(files.length);
      await Promise.all(
        Array.from(files).map((file, i) =>
          fetch(presigned[i].uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/pdf" },
            body: file,
          })
        )
      );
      const pdfKeys = presigned.map((item:Prisigned) => item.key);

      if (editNote) {
        await updateNote(editNote._id, { pdfKeys });
        Swal.fire("Updated!", "Note updated successfully", "success");
      } else {
        await createNote(topicId, { pdfKeys });
        Swal.fire("Added!", "Note uploaded successfully", "success");
      }

      setOpen(false);
      setEditNote(null);
      setFiles(null);
      loadNotes();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({ title: "Are you sure?", showCancelButton: true });
    if (result.isConfirmed) {
      await deleteNote(id);
      Swal.fire("Deleted!", "", "success");
      loadNotes();
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Notes</h2>
        <Button variant="contained" onClick={() => setOpen(true)}>Add Note</Button>
      </div>

      {notes.map(note => (
        <div key={note._id} className="border p-4 rounded mb-2">
          <p className="mb-2 text-sm text-gray-600">Uploaded: {new Date(note.uploadedAt).toLocaleString()}</p>
          <ul className="list-disc pl-5 mb-2">
            {note.pdfUrls.map((url, i) => (
              <li key={i}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">PDF {i + 1}</a>
              </li>
            ))}
          </ul>
          <div className="flex gap-3">
            <Button size="small" variant="outlined" onClick={() => { setEditNote(note); setOpen(true); }}>
              Edit
            </Button>
            <Button size="small" color="error" onClick={() => handleDelete(note._id)}>
              Delete
            </Button>
          </div>
        </div>
      ))}

      <Dialog open={open} onClose={() => { setOpen(false); setEditNote(null); setFiles(null); }} fullWidth maxWidth="sm">
        <DialogTitle>{editNote ? "Edit Note" : "Add Note"}</DialogTitle>
       <DialogContent>
  <input
    type="file"
    multiple
    accept=".pdf"
    onChange={e => setFiles(e.target.files)}
    className="my-4"
  />
  <div className="flex justify-end gap-3">
    {editNote && (
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => {
          setEditNote(null);
          setFiles(null);
          setOpen(false)
        }}
      >
        Cancel
      </Button>
    )}
    <Button variant="contained" onClick={handleAddEdit} disabled={uploading}>
      {uploading ? "Uploading..." : editNote ? "Update" : "Upload"}
    </Button>
  </div>
</DialogContent>

      </Dialog>
    </div>
  );
}
