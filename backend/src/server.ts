import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import app from './app';
import connectDB from './config/db';
import { Server } from 'socket.io';
// import { socketAuth } from './middlewares/socketAuth';
import { createSignalingServer } from './signaling/createSignalingServer';
const PORT = process.env.PORT || 5000;
// const httpServer=http.createServer(app)

const server = http.createServer(app);
createSignalingServer(server);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
