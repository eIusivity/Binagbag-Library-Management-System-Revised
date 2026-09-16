import { Server } from "socket.io";
import { auth } from "./auth/auth.js";
import { fromNodeHeaders } from "better-auth/node";
let io;
export function initializeSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "http://192.168.1.6:5173",
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(socket.request.headers),
    });
    if (!session?.user) {
      socket.disconnect();
      return;
    }
    socket.join(session.user.role);
    console.log(`${session.user.name} joined ${session.user.role}`);
  });
}
export function getIO() {
  if (!io) throw new Error("Socket IO not initialized");
  return io;
}
