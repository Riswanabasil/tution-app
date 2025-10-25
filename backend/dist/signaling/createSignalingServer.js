'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.createSignalingServer = createSignalingServer;
const socket_io_1 = require('socket.io');
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
function createSignalingServer(httpServer) {
  const io = new socket_io_1.Server(httpServer, {
    cors: { origin: '*', credentials: false },
  });
  // 1) Auth every socket connection with your JWT
  io.use((socket, next) => {
    var _a;
    try {
      const token =
        (socket.handshake.auth && socket.handshake.auth.token) ||
        (typeof socket.handshake.headers.authorization === 'string'
          ? socket.handshake.headers.authorization.replace('Bearer ', '')
          : '');
      if (!token) return next(new Error('NO_TOKEN'));
      const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
      socket.data.user = {
        id: user.id,
        role: user.role,
        name: (_a = user.name) !== null && _a !== void 0 ? _a : 'User',
      };
      next();
    } catch (err) {
      next(new Error('UNAUTHORIZED'));
    }
  });
  // 2) Event handlers
  io.on('connection', (socket) => {
    // Join a room for a specific session
    socket.on('room:join', (_a) =>
      __awaiter(this, [_a], void 0, function* ({ sessionId }) {
        if (!sessionId) return;
        yield socket.join(sessionId);
        // notify others in the room
        socket.to(sessionId).emit('peer:joined', {
          socketId: socket.id,
          user: socket.data.user,
        });
        // send the new client the list of current peers
        const sockets = yield io.in(sessionId).fetchSockets();
        const peers = sockets
          .filter((s) => s.id !== socket.id)
          .map((s) => ({ socketId: s.id, user: s.data.user }));
        socket.emit('room:peers', peers);
      }),
    );
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
