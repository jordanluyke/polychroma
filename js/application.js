$(document).ready(function() {
  polychroma.init("my-canvas-id");
  polychroma.connect("http://jordanluyke.com:5000");

  setTimeout(function() {
    if (polychroma.isConnected()) {
      $("#server-status").html("Connected! Try painting with friends!");
    } else {
      $("#server-status").html("Not connected.");
    }
  }, 1000);
});