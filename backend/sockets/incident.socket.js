module.exports = (io, socket) => {
  socket.on("joinIncident", (incidentId) => {
    const room = `incident_${incidentId}`;
    socket.join(room);
    console.log(
      `User ${
        socket.user ? socket.user.id : "Guest"
      } joined incident room ${room}`
    );
  });

  socket.on("leaveIncident", (incidentId) => {
    const room = `incident_${incidentId}`;
    socket.leave(room);
  });
};
