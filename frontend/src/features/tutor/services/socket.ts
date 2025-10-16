import { io, Socket } from "socket.io-client";

const API_URL =  import.meta.env.VITE_SOCKET_URL as string

// const API_URL="http://localhost:5000"

export function createSocket(token: string): Socket {
  return io(API_URL, {
    auth: { token },
    autoConnect: false,
  });
}
