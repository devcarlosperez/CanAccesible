import io from "socket.io-client";

let socket;

export const initSocket = (token) => {
  // If socket exists and is connected, check if we need to reconnect with new token?
  // For simplicity, if we call initSocket, we return existing or create new.

  if (!socket) {
    const url = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const options = {
      query: {},
      transports: ["websocket"],
    };

    if (token) {
      options.query.token = token;
    }

    socket = io(url, options);
  } else if (token && !socket.io.opts.query.token) {
    // If we have a socket but now we have a token (login), reconnect
    socket.disconnect();
    const url = import.meta.env.VITE_API_URL || "http://localhost:3000";
    socket = io(url, {
      query: { token },
      transports: ["websocket"],
    });
  }

  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
