var io = require('socket.io').listen(5000, { log: false });

io.sockets.on('connection', function (socket) {
  socket.emit('message', { message: "Welcome. Successfully connected to server." });
  console.log("New client connected. Current connected: " + io.sockets.server.sockets.sockets.length);

  socket.on('line', function (data) {
    var sockets = io.sockets.server.sockets.sockets;
    for (var index in sockets) {
      if (socket != sockets[index]) {
        sockets[index].emit('line', { line: data.line });
      }
    }
  });

  socket.on('disconnect', function (data) {
    console.log("Client disconnected. Current connected: " + (io.sockets.server.sockets.sockets.length));
  });
});