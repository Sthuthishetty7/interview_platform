const { Server } = require("socket.io");

const MAX_PEOPLE_PER_ROOM = 2; // an interview is one interviewer plus one candidate

function isValidRoomCode(roomCode) {
  return typeof roomCode === "string" && roomCode.length >= 3 && roomCode.length <= 64;
}

function attachSignaling(httpServer, allowedOrigin) {
  const io = new Server(httpServer, {
    cors: { origin: allowedOrigin }, // only your frontend may connect
  });

  io.on("connection", (socket) => {
    // A person asks to enter a room.
    socket.on("room:join", async (data) => {
      const roomCode = data && data.roomCode;
      if (!isValidRoomCode(roomCode)) {
        socket.emit("room:error", { message: "Invalid room code." });
        return;
      }

      const peopleInRoom = await io.in(roomCode).fetchSockets();
      if (peopleInRoom.length >= MAX_PEOPLE_PER_ROOM) {
        socket.emit("room:error", { message: "This room is full." });
        return;
      }

      socket.join(roomCode);
      socket.data.roomCode = roomCode;

      // Tell the newcomer who is already there...
      socket.emit("room:joined", { peerIds: peopleInRoom.map((p) => p.id) });
      // ...and tell the person already in the room that someone arrived.
      socket.to(roomCode).emit("participant:joined", { id: socket.id });
    });

    // These three events carry the video-call setup messages.
    // The server does not read them. It only passes them to the other person.
    const relayedEvents = ["webrtc:offer", "webrtc:answer", "webrtc:ice-candidate"];
    for (const eventName of relayedEvents) {
      socket.on(eventName, (payload) => {
        const roomCode = socket.data.roomCode;
        if (!roomCode || typeof payload !== "object" || payload === null) return;
        socket.to(roomCode).emit(eventName, { ...payload, from: socket.id });
      });
    }

    // When someone closes the page or loses connection, tell the other person.
    socket.on("disconnect", () => {
      const roomCode = socket.data.roomCode;
      if (roomCode) {
        socket.to(roomCode).emit("participant:left", { id: socket.id });
      }
    });
  });

  console.log("Signaling (Socket.IO) ready");
  return io;
}

module.exports = { attachSignaling };