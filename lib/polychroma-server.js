var io = require('socket.io').listen(5000, { log: false });

io.sockets.on('connection', function (socket) {
  socket.emit('message', { message: "Welcome. Successfully connected to server." });
  console.log("New client connected. Current connected: " + io.sockets.clients().length);

  socket.on('line', function (data) {
    for (var index in io.sockets.clients()) {
      if (socket != io.sockets.clients()[index]) {
        io.sockets.clients()[index].emit('line', { line: data.line });
      }
    }
  });

  socket.on('disconnect', function (data) {
    console.log("Client disconnected. Current connected: " + io.sockets.clients().length);
  });
});