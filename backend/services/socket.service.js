const socketIo = require("socket.io");
const conversationSocket = require("../sockets/conversation.socket");
const incidentSocket = require("../sockets/incident.socket");

let io;

function init(server) {
  io = socketIo(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://canaccesible.es",
        "https://www.canaccesible.es",
      ],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.query.token;
    if (!token) {
      // Allow guest connection for public features (like incidents)
      socket.user = null;
      return next();
    }
    const jwt = require("jsonwebtoken");
    const { jwtConfig } = require("../config/jwt");
    jwt.verify(token, jwtConfig.secret, (err, decoded) => {
      if (err) {
        // If token is invalid, treat as guest? Or fail?
        // For backward compatibility with conversation service which required auth,
        // we should probably allow it but maybe the client handles the error.
        // However, if we want guests to view comments, we must allow connection.
        // Let's log the error but allow connection as guest.
        console.warn("Socket auth failed, proceeding as guest:", err.message);
        socket.user = null;
        return next();
      }
      socket.user = decoded;
      next();
    });
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.user ? socket.user.id : "Guest");

    // Initialize socket handlers
    conversationSocket(io, socket);
    incidentSocket(io, socket);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user ? socket.user.id : "Guest");
    });
  });

  return io;
}

function getIo() {
  return io;
}

module.exports = { init, getIo };
