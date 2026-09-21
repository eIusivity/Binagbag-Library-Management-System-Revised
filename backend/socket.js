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
  const onlineUsers = new Map();
  io.on("connection", async (socket) => {
    socket.on("user:online", (userId) => {
      socket.userId = userId;
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }

      onlineUsers.get(userId).add(socket.id);
    });

    socket.on("disconnect", () => {
      const userId = socket.userId;
      if (!userId) return;
      const sockets = onlineUsers.get(userId);
      sockets?.delete(socket.id);
      if (sockets?.size === 0) {
        onlineUsers.delete(userId);
      }
    });

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(socket.request.headers),
    });
    if (!session?.user) {
      socket.disconnect();
      return;
    }
    socket.join(session.user.role);
  });
}
export function getIO() {
  if (!io) throw new Error("Socket IO not initialized");
  return io;
}
