
import dotenv from 'dotenv';
import http from 'http'
import app from './app';
import connectDB from './config/db';
import {Server} from 'socket.io'
// import { socketAuth } from './middlewares/socketAuth';
import { createSignalingServer } from './signaling/createSignalingServer';
const PORT = process.env.PORT || 5000;
// const httpServer=http.createServer(app)

const server = http.createServer(app);
createSignalingServer(server);

// export const io = new Server(httpServer, {
//   cors: {
//     origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
//     methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
//     credentials: true,
//   },
// });

// io.use(socketAuth(process.env.JWT_SECRET!));
dotenv.config();
import './signaling';

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
