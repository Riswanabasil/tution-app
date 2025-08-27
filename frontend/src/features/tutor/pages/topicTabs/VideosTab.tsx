import { useEffect, useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import {
  listVideosByTopic,
  getVideoUploadUrl,
  createVideo,
  updateVideo,
  deleteVideo,
  type VideoItem,
} from '../../services/NoteApi';

type Props = { topicId: string };

export default function VideosTab({ topicId }: Props) {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<VideoItem | null>(null);

  // form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [durationSec, setDurationSec] = useState<number>(0);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listVideosByTopic(topicId);
      setVideos(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [topicId]);

  const onFileChange = (f: File | null) => {
    setFile(f);
    if (!f) {
      setDurationSec(0);
      return;
    }
    const url = URL.createObjectURL(f);
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.src = url;
    v.onloadedmetadata = () => {
      setDurationSec(Math.ceil(v.duration || 0));
      URL.revokeObjectURL(url);
    };
    v.onerror = () => {
      setDurationSec(0);
      URL.revokeObjectURL(url);
    };
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFile(null);
    setDurationSec(0);
    setEditing(null);
  };

  const handleSave = async () => {
    try {
      setUploading(true);

      if (editing) {
        await updateVideo(editing._id, { title, description, durationSec });
        Swal.fire('Updated!', 'Video updated successfully', 'success');
        setOpen(false);
        resetForm();
        load();
        return;
      }

      if (!file) {
        Swal.fire('Required', 'Select a video file', 'warning');
        return;
      }

      const { uploadUrl, key } = await getVideoUploadUrl(file.name, file.type);
      console.log('uploadUrl', uploadUrl, key);

      const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error('Upload failed');

      await createVideo({
        topicId,
        title,
        description,
        durationSec: durationSec || 0,
        key,
        contentType: file.type,
      });

      Swal.fire('Added!', 'Video uploaded successfully', 'success');
      setOpen(false);
      resetForm();
      load();
    } catch (e: any) {
      console.error(e);
      Swal.fire('Error', e?.message || 'Something went wrong', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const c = await Swal.fire({
      title: 'Delete this video?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it',
    });
    if (!c.isConfirmed) return;
    await deleteVideo(id);
    Swal.fire('Deleted!', 'Video removed', 'success');
    load();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Videos</h2>
            <p className="text-sm text-slate-500">
              {videos.length} {videos.length === 1 ? 'video' : 'videos'} available
            </p>
          </div>
        </div>

        <Button
          onClick={() => {
            setOpen(true);
            resetForm();
          }}
          variant="contained"
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
        >
          Add Video
        </Button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="font-medium text-slate-600">Loading videos...</p>
        </div>
      ) : videos.length === 0 ? (
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
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-800">No videos yet</h3>
          <p className="mx-auto mb-6 max-w-md text-slate-500">Upload your first topic video.</p>
          <Button
            onClick={() => {
              setOpen(true);
              resetForm();
            }}
            variant="contained"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
          >
            Upload Video
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {videos.map((v, idx) => (
            <div
              key={v._id}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4 p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100">
                    <span className="text-sm font-bold text-indigo-600">#{idx + 1}</span>
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-slate-800">{v.title}</h3>
                    <p className="text-sm text-slate-500">
                      Duration:{' '}
                      {v.durationSec
                        ? `${Math.floor(v.durationSec / 60)}m ${v.durationSec % 60}s`
                        : '—'}{' '}
                      • Uploaded {new Date(v.createdAt).toLocaleDateString()}
                    </p>
                    {v.description && (
                      <p className="mt-2 text-sm text-slate-600">{v.description}</p>
                    )}
                    {/* Simple preview link (you can swap to a player later) */}
                    <a
                      href={v.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block text-indigo-600 hover:underline"
                    >
                      Open video
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-60 transition-opacity duration-200 group-hover:opacity-100">
                  <button
                    onClick={() => {
                      setEditing(v);
                      setTitle(v.title);
                      setDescription(v.description || '');
                      setDurationSec(v.durationSec || 0);
                      setOpen(true);
                    }}
                    className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                    title="Edit video"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(v._id)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                    title="Delete video"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1 1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
        fullWidth
        maxWidth="sm"
        PaperProps={{ style: { borderRadius: '16px', overflow: 'hidden' } }}
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
                {editing ? (
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
              {editing ? 'Edit Video' : 'Upload Video'}
            </span>
          </div>
        </DialogTitle>

        <DialogContent className="space-y-4 p-6">
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {!editing && (
            <>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => onFileChange(e.target.files?.[0] || null)}
              />
              <div className="text-sm text-slate-600">
                Duration:{' '}
                {durationSec ? `${Math.floor(durationSec / 60)}m ${durationSec % 60}s` : '—'}
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outlined"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!title || uploading || (!editing && !file)}
              style={{
                background:
                  !title || uploading || (!editing && !file)
                    ? '#94a3b8'
                    : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              }}
            >
              {uploading ? 'Uploading…' : editing ? 'Update' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
