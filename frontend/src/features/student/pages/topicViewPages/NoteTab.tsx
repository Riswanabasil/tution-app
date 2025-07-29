import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {fetchNotesByTopicId } from "../../services/CourseApi";

interface Note {
  _id: string;
  pdfUrls: string[];
  uploadedAt: string;
}

const NoteTab = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (topicId) {
      fetchNotesByTopicId(topicId).then(setNotes).catch(console.error);
    }
  }, [topicId]);

  return (
    <div className="space-y-4">
      {notes.length === 0 ? (
        <p>No notes found for this topic.</p>
      ) : (
        notes.map((note) => (
          <div key={note._id} className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Uploaded: {new Date(note.uploadedAt).toLocaleDateString()}</p>
            <ul className="list-disc ml-6 mt-2">
              {note.pdfUrls.map((url, i) => (
                <li key={i}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View PDF {i + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default NoteTab;
