$(document).ready(function() {
  polychroma.init('my-canvas-id', 640, 400);
  polychroma.connect('http://35.162.7.41:5000');

  setTimeout(function() {
    if (polychroma.isConnected()) {
      $('#server-status').html('Connected! Try painting with friends!');
    } else {
      $('#server-status').html('Not connected.');
    }
  }, 1000);
});
