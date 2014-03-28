var io = require('socket.io').listen(5000, { log: false });

io.sockets.on('connection', function (socket) {
  socket.emit('message', { message: "Welcome." });
  console.log("New client connected.");
  console.log("Current number of clients: " + io.sockets.clients().length);

  socket.on('line', function (data) {
    io.sockets.emit('line', { line: data.line });
  });

  socket.on('disconnect', function (data) {
    console.log("Client disconnected.")
    console.log("Current number of clients: " + io.sockets.clients().length);
  });
});