import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import type { Socket } from "socket.io-client";
import { createSocket } from "../../services/socket";
import { rtcConfig } from "../../../../wertc/rtcConfig";
import { getLiveSession } from "../../services/LiveSessionApi";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

type PeerInfo = { socketId: string; user: any };


function getAuthToken(): string | null {
  return (
    localStorage.getItem("tutorAccessToken") ||
    localStorage.getItem("accessToken") ||               
    localStorage.getItem("studentAccessToken") ||         
    null
  );
}

export default function LiveSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const token = getAuthToken();

  const socketRef = useRef<Socket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());

  const [session, setSession] = useState<any>(null);
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(true);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [ended, setEnded] = useState(false);
  const [peerInfo, setPeerInfo] = useState<Record<string, { id: string; role: string; name: string }>>({});

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!sessionId) {
        setError("Missing session id");
        setConnecting(false);
        return;
      }
      if (!token) {
        setError("Missing auth token");
        setConnecting(false);
        return;
      }

      try {
        // Load metadata (non-blocking)
        getLiveSession(sessionId).then(setSession).catch(() => {});

        // 1) Local media
        const local = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!mounted) return;
        localStreamRef.current = local;
        const localEl = document.getElementById("local-video") as HTMLVideoElement | null;
        if (localEl) localEl.srcObject = local;

        // 2) Socket connect
        const socket = createSocket(token);
        socketRef.current = socket;

        socket.on("connect", () => {
          socket.emit("room:join", { sessionId });
        });

        // initial peers (we call them)
        socket.on("room:peers", async (peers: PeerInfo[]) => {
           setPeerInfo((prev) => {
    const copy = { ...prev };
    peers.forEach((p) => { copy[p.socketId] = p.user; });
    return copy;
  });
          for (const p of peers) await callPeer(p.socketId);
          setConnecting(false);
        });

        // socket.on("peer:joined", ({ socketId }: { socketId: string }) => {
        //   console.log("peer joined:", socketId);
        // });

        socket.on("peer:joined", ({ socketId, user }: { socketId: string; user: any }) => {
  setPeerInfo((prev) => ({ ...prev, [socketId]: user }));
  // (they will send us an offer; we don't call here)
});

        // WebRTC signaling
        socket.on("webrtc:offer", async ({ from, sdp }) => {
          const pc = getOrCreatePC(from);
          await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("webrtc:answer", { to: from, sdp: pc.localDescription });
        });

        socket.on("webrtc:answer", async ({ from, sdp }) => {
          const pc = peersRef.current.get(from);
          if (pc) await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        });

        socket.on("webrtc:ice", async ({ from, candidate }) => {
          const pc = getOrCreatePC(from);
          if (candidate) await pc.addIceCandidate(new RTCIceCandidate(candidate));
        });

        // socket.on("peer:left", ({ socketId }) => {
        //   const pc = peersRef.current.get(socketId);
        //   if (pc) pc.close();
        //   peersRef.current.delete(socketId);
        //   setRemoteStreams((prev) => {
        //     const next = { ...prev };
        //     delete next[socketId];
        //     return next;
        //   });
        // });

        socket.on("peer:left", ({ socketId }) => {
  const pc = peersRef.current.get(socketId);
  if (pc) pc.close();
  peersRef.current.delete(socketId);
  setRemoteStreams((prev) => {
    const next = { ...prev };
    delete next[socketId];
    return next;
  });
  setPeerInfo((prev) => {
    const next = { ...prev };
    delete next[socketId];
    return next;
  });
});

        // session ended by tutor from the tab
        socket.on("session:ended", () => {
          setEnded(true);
          setTimeout(() => leaveRoom(), 1200);
        });

        socket.on("connect_error", (e) => {
          setError(e?.message || "Socket connect error");
          setConnecting(false);
        });

        socket.connect();
      } catch (e: any) {
        setError(e?.message || "Failed to access camera/mic");
        setConnecting(false);
      }
    })();

    return () => {
      mounted = false;
      leaveRoom(false); // silent on unmount
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, token]);

  // ---- helpers ----
  async function callPeer(peerId: string) {
    const pc = getOrCreatePC(peerId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socketRef.current?.emit("webrtc:offer", { to: peerId, sdp: pc.localDescription });
  }

  function getOrCreatePC(id: string) {
    let pc = peersRef.current.get(id);

    if (pc && pc.signalingState === "closed") {
      try { pc.close(); } catch {}
      peersRef.current.delete(id);
      pc = undefined as any;
    }

    if (pc) return pc;

    pc = new RTCPeerConnection(rtcConfig);

    // add local tracks
    const stream = localStreamRef.current!;
    stream.getTracks().forEach((t) => {
      try { pc!.addTrack(t, stream); } catch (err) { console.warn("addTrack failed", err); }
    });

    // remote media
    pc.ontrack = (ev) => {
      const [stream] = ev.streams;
      setRemoteStreams((prev) => ({ ...prev, [id]: stream }));
    };

    // our ICE → send to peer
    pc.onicecandidate = (ev) => {
      if (ev.candidate) socketRef.current?.emit("webrtc:ice", { to: id, candidate: ev.candidate });
    };

    peersRef.current.set(id, pc);
    return pc;
  }

  // Leave cleanup
  function leaveRoom(navigateBack = true) {
    try {
      socketRef.current?.emit("room:leave", { sessionId });
      socketRef.current?.disconnect();
    } catch {}
    try {
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
    } catch {}
    peersRef.current.forEach((pc) => pc.close());
    peersRef.current.clear();
    setRemoteStreams({});
    if (navigateBack) navigate(-1);
  }

  function toggleMic() {
    const stream = localStreamRef.current;
    if (!stream) return;
    const next = !micOn;
    stream.getAudioTracks().forEach((t) => (t.enabled = next));
    setMicOn(next);
  }

  function toggleCam() {
    const stream = localStreamRef.current;
    if (!stream) return;
    const next = !camOn;
    stream.getVideoTracks().forEach((t) => (t.enabled = next));
    setCamOn(next);
  }

  // ---- UI ----
  return (
    <div className="flex flex-col items-center p-6">
      <div className="flex w-full max-w-5xl items-center justify-between">
        <h1 className="text-2xl font-bold">
          Live Session: {session?.title || sessionId}
        </h1>
        <Link to={-1 as any} className="rounded bg-slate-200 px-3 py-1.5">Back</Link>
      </div>

      <div className="mt-6 grid w-full max-w-5xl gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-2 text-lg font-semibold">You</h2>
          <video id="local-video" autoPlay muted playsInline className="w-full rounded-lg border" />
        </div>

        {/* <div>
          <h2 className="mb-2 text-lg font-semibold">Remote</h2>
          {Object.entries(remoteStreams).length === 0 ? (
            <div className="h-48 rounded-lg border bg-slate-50" />
          ) : (
            Object.entries(remoteStreams).map(([id, stream]) => (
              <video
                key={id}
                autoPlay
                playsInline
                className="w-full rounded-lg border"
                ref={(el) => { if (el && stream && el.srcObject !== stream) el.srcObject = stream; }}
              />
            ))
          )}
        </div> */}
        <div>
  <h2 className="mb-2 text-lg font-semibold">Remote</h2>

  {Object.entries(remoteStreams).length === 0 ? (
    <div className="h-48 rounded-lg border bg-slate-50" />
  ) : (
    Object.entries(remoteStreams).map(([socketId, stream]) => {
      const meta = peerInfo[socketId];
      const label = meta?.name || "Remote";
      console.log("name",label);
      
      const role = meta?.role || "";

      return (
        <div key={socketId} className="relative mb-4">
          <video
            autoPlay
            playsInline
            className="w-full rounded-lg border"
            ref={(el) => { if (el && stream && el.srcObject !== stream) el.srcObject = stream; }}
          />
          {/* Name pill */}
          <div className="absolute left-2 bottom-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
            {/* {label}{role ? ` · ${role}` : ""} */}
             {label}
          </div>
        </div>
      );
    })
  )}
</div>

      </div>

      {/* Control bar */}
      <div className="mt-8 flex gap-6">
        <button
          onClick={toggleMic}
          className="rounded-full p-4 bg-white shadow hover:bg-gray-100"
          title={micOn ? "Mute" : "Unmute"}
        >
          {micOn ? <Mic className="h-6 w-6 text-gray-800" /> : <MicOff className="h-6 w-6 text-red-600" />}
        </button>

        <button
          onClick={toggleCam}
          className="rounded-full p-4 bg-white shadow hover:bg-gray-100"
          title={camOn ? "Turn camera off" : "Turn camera on"}
        >
          {camOn ? <Video className="h-6 w-6 text-gray-800" /> : <VideoOff className="h-6 w-6 text-red-600" />}
        </button>

        <button
          onClick={() => leaveRoom(true)}
          className="rounded-full p-4 bg-red-600 hover:bg-red-700 shadow text-white"
          title="Leave call"
        >
          <PhoneOff className="h-6 w-6" />
        </button>
      </div>

      <div className="mt-4 text-sm text-slate-600">
        {error ? <span className="text-red-600">{error}</span> : connecting ? "Connecting…" : "Connected"}
      </div>

      {ended && (
        <div className="mt-6 rounded bg-red-600 px-4 py-2 text-white">
          Session ended by tutor
        </div>
      )}
    </div>
  );
}
