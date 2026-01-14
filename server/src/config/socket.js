import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

 io.on("connection", (socket) => {
  console.log("🔌 CONNECTED socket.id =", socket.id);

  socket.on("join", (userId) => {
    console.log("📥 JOIN EVENT RECEIVED userId =", userId, "type =", typeof userId);

    socket.join(userId);

    const rooms = [...socket.rooms];
    console.log("🏠 SOCKET ROOMS =", rooms);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ DISCONNECTED socket.id =", socket.id, "reason =", reason);
  });
});



  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
