import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import type { Server as HttpServer } from 'http';

type UserPayload = {
  id: string;
  role: 'tutor' | 'student' | 'admin';
  email?: string;
  name?: string;
};

export function createSignalingServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: { origin: '*', credentials: false },
  });

  // 1) Auth every socket connection with your JWT
  io.use((socket, next) => {
    try {
      const token =
        (socket.handshake.auth && socket.handshake.auth.token) ||
        (typeof socket.handshake.headers.authorization === 'string'
          ? socket.handshake.headers.authorization.replace('Bearer ', '')
          : '');

      if (!token) return next(new Error('NO_TOKEN'));
      const user = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
      socket.data.user = { id: user.id, role: user.role, name: user.name ?? 'User' };
      next();
    } catch (err) {
      next(new Error('UNAUTHORIZED'));
    }
  });

  // 2) Event handlers
  io.on('connection', (socket) => {
    // Join a room for a specific session
    socket.on('room:join', async ({ sessionId }: { sessionId: string }) => {
      if (!sessionId) return;
      await socket.join(sessionId);

      // notify others in the room
      socket.to(sessionId).emit('peer:joined', {
        socketId: socket.id,
        user: socket.data.user,
      });

      // send the new client the list of current peers
      const sockets = await io.in(sessionId).fetchSockets();
      const peers = sockets
        .filter((s) => s.id !== socket.id)
        .map((s) => ({ socketId: s.id, user: s.data.user }));
      socket.emit('room:peers', peers);
    });

    // Relay WebRTC messages
    socket.on('webrtc:offer', ({ to, sdp }) =>
      io.to(to).emit('webrtc:offer', { from: socket.id, sdp }),
    );
    socket.on('webrtc:answer', ({ to, sdp }) =>
      io.to(to).emit('webrtc:answer', { from: socket.id, sdp }),
    );
    socket.on('webrtc:ice', ({ to, candidate }) =>
      io.to(to).emit('webrtc:ice', { from: socket.id, candidate }),
    );

    // On leaving, notify peers in each joined room (except the socket’s own room)
    socket.on('disconnecting', () => {
      for (const room of socket.rooms) {
        if (room !== socket.id) {
          socket.to(room).emit('peer:left', { socketId: socket.id });
        }
      }
    });
  });

  return io;
}
