var io = require('socket.io').listen(5000);

io.sockets.on('connection', function (socket) {
  // initialize
  socket.emit('message', { message: "welcome" });

  socket.on('line', function (data) {
    console.log(data.line);
    socket.emit('line', { line: data.line });
  });
  socket.on('disconnect', function (data) {

  });
});