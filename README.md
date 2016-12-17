polychroma
==========

Description
-----------

A small paint app written in JavaScript using HTML5's canvas element.

Multiplayer paint when used with server.

Usage
-----

Without server:
```javascript
$(document).ready(function() {
  polychroma.init("my-canvas-id");
}
```

With server:
```javascript
$(document).ready(function() {
  polychroma.init("my-canvas-id");
  polychroma.connect("http://localhost:5000");
}
```

Start server:
```javascript
node polychroma-server.js
```

That's it.

Requirements
------------

For client:
- A modern browser

For server:
- Nodejs: [http://nodejs.org/](http://nodejs.org/)
- SocketIO: [http://socket.io/](http://socket.io/)