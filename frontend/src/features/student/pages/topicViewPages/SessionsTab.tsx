import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  fetchStudentSessionsByTopic,
  type StudentLiveSessionDTO,
} from '../../services/LiveSessionApi';

export default function SessionsTab() {
  const { topicId } = useParams<{ topicId: string }>();
  const [sessions, setSessions] = useState<StudentLiveSessionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'live' | 'scheduled' | 'ended'>('all');

  const load = async () => {
    if (!topicId) return;
    try {
      setLoading(true);
      const data = await fetchStudentSessionsByTopic(
        topicId,
        filter === 'all' ? undefined : filter
      );
      setSessions(data);
    } catch (e: any) {
      Swal.fire('Error', e?.message || 'Unable to fetch sessions', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    
  }, [topicId, filter]);

 
  useEffect(() => {
    const id = setInterval(load, 10000);
    return () => clearInterval(id);

  }, [topicId, filter]);

  const pill = (status: StudentLiveSessionDTO['status']) => {
    const base = 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold';
    if (status === 'live') return `${base} bg-emerald-100 text-emerald-700`;
    if (status === 'scheduled') return `${base} bg-amber-100 text-amber-700`;
    return `${base} bg-slate-100 text-slate-600`;
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Live Sessions</h2>
            <p className="text-gray-600">
              Join a session when it’s marked <span className="font-semibold text-emerald-700">LIVE</span>.
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            {(['all', 'live', 'scheduled', 'ended'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${
                  filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-600">
            Loading sessions…
          </div>
        ) : sessions.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
              <svg className="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-700">No sessions found</h3>
            <p className="max-w-md mx-auto text-gray-500">
              Your tutor hasn’t started any live sessions for this topic yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((s) => (
              <div key={s._id}
                className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/80 p-5 shadow-lg backdrop-blur-sm">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{s.title}</h3>
                  {s.description && <p className="text-sm text-slate-600 mt-1">{s.description}</p>}
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    {s.scheduledAt
                      ? <span>Scheduled: {new Date(s.scheduledAt).toLocaleString()}</span>
                      : <span>Created: {new Date(s.createdAt).toLocaleString()}</span>}
                    <span className={pill(s.status)}>{s.status.toUpperCase()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {s.status === 'live' ? (
                    <Link
                      to={`/student/live/${s._id}`}
                      className="rounded-xl bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700"
                    >
                      Join
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="rounded-xl bg-slate-200 px-4 py-2 text-slate-600 cursor-not-allowed"
                      title={s.status === 'scheduled' ? 'Not live yet' : 'Session ended'}
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
