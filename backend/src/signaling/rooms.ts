export type Participant = {
  socketId: string;
  userId: string;
  name?: string;
  role: 'tutor' | 'student' | 'admin';
};

const rooms = new Map<string, Participant[]>(); 

export function joinRoom(roomKey: string, p: Participant) {
  const list = rooms.get(roomKey) ?? [];
  const next = [...list, p];
  rooms.set(roomKey, next);
  return { peers: next };
}

export function leaveRoom(roomKey: string, socketId: string) {
  const list = rooms.get(roomKey) ?? [];
  const next = list.filter((x) => x.socketId !== socketId);
  if (next.length > 0) rooms.set(roomKey, next);
  else rooms.delete(roomKey);
}

export function peersIn(roomKey: string) {
  return rooms.get(roomKey) ?? [];
}
