import { io, Socket } from "socket.io-client";

const API_URL =  "http://localhost:5000";

export function createSocket(token: string): Socket {
  return io(API_URL, {
    auth: { token },
    autoConnect: false,
  });
}
