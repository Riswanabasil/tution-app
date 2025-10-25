// import { liveSessionService } from '../composition/liveSessionDeps';
// import { joinRoom, leaveRoom } from './rooms';
// import { io } from '../server';

// io.on('connection', (socket) => {
//   let roomKey: string | null = null;

//   socket.on('join', async ({ sessionId }: { sessionId: string }) => {
//     try {
//       const user = socket.data.user as { id: string; role: 'student'|'tutor'|'admin'; name?: string };
//       if (!user?.id) return socket.emit('join-error', 'unauthorized');

//       await liveSessionService.assertUserCanJoinSession(sessionId, user);

//       roomKey = `session:${sessionId}`;
//       socket.join(roomKey);

//       const { peers } = joinRoom(roomKey, { socketId: socket.id, userId: user.id, role: user.role, name: user.name });

//       socket.emit('peers', peers.filter(p => p.socketId !== socket.id));
//       socket.to(roomKey).emit('peer-joined', { socketId: socket.id, userId: user.id, role: user.role, name: user.name });
//     } catch (e: any) {
//       socket.emit('join-error', String(e?.message || 'internal').toLowerCase());
//     }
//   });

//   socket.on('offer',  ({ to, sdp }) => to && io.to(to).emit('offer',  { from: socket.id, sdp }));
//   socket.on('answer', ({ to, sdp }) => to && io.to(to).emit('answer', { from: socket.id, sdp }));
//   socket.on('ice-candidate', ({ to, candidate }) => to && io.to(to).emit('ice-candidate', { from: socket.id, candidate }));

//   socket.on('leave', () => cleanup());
//   socket.on('disconnect', () => cleanup());

//   function cleanup() {
//     if (!roomKey) return;
//     socket.to(roomKey).emit('peer-left', { socketId: socket.id });
//     leaveRoom(roomKey, socket.id);
//     socket.leave(roomKey);
//     roomKey = null;
//   }
// });
