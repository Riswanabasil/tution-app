import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Button, Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";

import {
  fetchLiveSessionsByTopic,
  createLiveSession,
  updateLiveSession,
  deleteLiveSession,
  updateLiveSessionStatus,
  type LiveSessionDTO,
} from "../../services/LiveSessionApi";

type LiveTabProps = { topicId: string };

export default function LiveTab({ topicId }: LiveTabProps) {
  const [sessions, setSessions] = useState<LiveSessionDTO[]>([]);
  const [open, setOpen] = useState(false);
  const [editSession, setEditSession] = useState<LiveSessionDTO | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  const loadSessions = async () => {
    try {
      const data = await fetchLiveSessionsByTopic(topicId);
      setSessions(data);
    } catch (err) {
      console.error("Failed to load sessions", err);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [topicId]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setScheduledAt("");
    setEditSession(null);
  };

  const handleSubmit = async () => {
    const payload = { title: title.trim(), description: description.trim(), scheduledAt: scheduledAt || undefined };
    if (!payload.title) return;

    try {
      if (editSession) {
        await updateLiveSession(editSession._id, payload);
        Swal.fire("Updated!", "Live session updated", "success");
      } else {
        await createLiveSession(topicId, payload);
        Swal.fire("Created!", "Live session created", "success");
      }
      setOpen(false);
      resetForm();
      loadSessions();
    } catch (err: any) {
      Swal.fire("Error", err?.message || "Something went wrong", "error");
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Delete session?",
      text: "This will permanently delete the session.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    });
    if (!confirm.isConfirmed) return;
    await deleteLiveSession(id);
    Swal.fire("Deleted!", "Session deleted", "success");
    loadSessions();
  };

  const startSession = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Start session?",
      text: "Students will be able to join once it’s live.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Start",
      confirmButtonColor: "#059669",
    });
    if (!confirm.isConfirmed) return;

    await updateLiveSessionStatus(id, "live");
    Swal.fire("Started", "Session is now live. Use Join to enter.", "success");
    loadSessions();
  };

  const endSession = async (id: string) => {
    const confirm = await Swal.fire({
      title: "End session for everyone?",
      text: "Anyone still inside will be disconnected.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "End Session",
      confirmButtonColor: "#dc2626",
    });
    if (!confirm.isConfirmed) return;

    await updateLiveSessionStatus(id, "ended");
    Swal.fire("Ended", "Session marked as ended", "success");
    loadSessions();
  };

  const statusPill = (status: LiveSessionDTO["status"]) => {
    const base = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold";
    if (status === "live") return `${base} bg-emerald-100 text-emerald-700`;
    if (status === "scheduled") return `${base} bg-amber-100 text-amber-700`;
    return `${base} bg-slate-100 text-slate-600`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Live Sessions</h2>
          <p className="text-sm text-slate-500">
            {sessions.length} {sessions.length === 1 ? "session" : "sessions"} total
          </p>
        </div>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            borderRadius: "12px",
          }}
        >
          + Create Session
        </Button>
      </div>

      {/* List */}
      {sessions.length === 0 ? (
        <div className="py-16 text-center text-slate-500">
          No sessions yet for this topic.
        </div>
      ) : (
        <div className="grid gap-4">
          {sessions.map((s) => (
            <div
              key={s._id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="truncate text-lg font-semibold text-slate-800">{s.title}</h3>
                  <span className={statusPill(s.status)}>{s.status.toUpperCase()}</span>
                </div>
                {s.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">{s.description}</p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  {s.scheduledAt
                    ? <>Scheduled: {new Date(s.scheduledAt).toLocaleString()}</>
                    : <>Created: {new Date(s.createdAt).toLocaleString()}</>}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Scheduled → Start */}
                {s.status === "scheduled" && (
                  <button
                    onClick={() => startSession(s._id)}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700"
                    title="Set status to LIVE"
                  >
                    Start
                  </button>
                )}

                {/* Live → Join + End */}
                {s.status === "live" && (
                  <>
                    <Link
                      to={`/tutor/live/${s._id}`}
                      className="rounded-lg bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700"
                      title="Open the live room"
                    >
                      Join
                    </Link>
                    <button
                      onClick={() => endSession(s._id)}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-white hover:bg-red-700"
                      title="Mark session as ENDED"
                    >
                      End
                    </button>
                  </>
                )}

                {/* Ended → badge */}
                {s.status === "ended" && (
                  <span className="rounded-lg bg-slate-200 px-3 py-1.5 text-slate-600">Ended</span>
                )}

                {/* Edit / Delete */}
                <button
                  onClick={() => {
                    setEditSession(s);
                    setTitle(s.title);
                    setDescription(s.description || "");
                    setScheduledAt(s.scheduledAt ? s.scheduledAt.slice(0, 16) : ""); // yyyy-MM-ddTHH:mm
                    setOpen(true);
                  }}
                  className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
        fullWidth
        maxWidth="sm"
        PaperProps={{ style: { borderRadius: "16px" } }}
      >
        <DialogTitle>{editSession ? "Edit Live Session" : "Create Live Session"}</DialogTitle>
        <DialogContent className="space-y-4">
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
          <TextField
            label="Scheduled At"
            type="datetime-local"
            fullWidth
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <div className="flex justify-end gap-2 pt-4">
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
              onClick={handleSubmit}
              disabled={!title.trim()}
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
            >
              {editSession ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
