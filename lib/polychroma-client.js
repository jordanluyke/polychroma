var polychroma = (function() {

  var init = function(canvasId) {
    const canvasWidth = 640;
    const canvasHeight = 400;
    var canvas = $("#" + canvasId)[0];
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    Binder.bindKeys(canvas);
    Controller.ctx = ctx;
    Controller.localPoint = new Point();
    var socket = io.connect('http://54.186.198.160:5000/');
    // var socket = io.connect('http://localhost:5000/');
    Controller.socket = socket;
    Binder.bindSockets(socket);
  };

  function Point() {
    this.x = 0;
    this.y = 0;
    this.lastPoint = {};
    this.color = "#FFFFFF";
    this.lineWidth = 10;
  };

  Point.prototype = {
    setPoint: function(x, y) {
      this.setLastPoint(this.x, this.y);
      this.x = x;
      this.y = y;
    },

    setLastPoint: function(x, y) {
      this.lastPoint.x = x;
      this.lastPoint.y = y;
    },

    distanceTo: function(x, y) {
      return Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2));
    },

    setRandomColor: function() {
      this.color = "#" + Math.floor(Math.random() * 16777215).toString(16); // credit: Paul Irish
    }
  };

  var Controller = {
    ctx: {},

    localPoint: {},

    mouseIsDown: false,

    socket: {},

    mouseDownEvent: function(e) {
      this.localPoint.setPoint(e.offsetX, e.offsetY);
      this.mouseIsDown = true;
    },

    mouseMoveEvent: function(e) {
      if (this.mouseIsDown) {
        if (this.localPoint.distanceTo(e.offsetX, e.offsetY) > 10) {
          this.localPoint.setPoint(e.offsetX, e.offsetY);
          this.localPoint.setRandomColor();
          this.socket.emit('line', { line: this.localPoint });
          View.renderLine(this.ctx, this.localPoint);
        }
      }
    },

    mouseUpEvent: function(e) {
      this.mouseIsDown = false;
    },

    socketReceiveLine: function(data) {
      console.log(data.line);
      View.renderLine(this.ctx, data.line);
    }
  };

  var Binder = {
    bindKeys: function(canvas) {
      this.bindMouseDown(canvas);
      this.bindMouseMove(canvas);
      this.bindMouseUp();
    },

    bindSockets: function(socket) {
      this.bindSocketMessage(socket);
      this.bindSocketLine(socket);
    },

    bindMouseDown: function(canvas) {
      $(canvas).on("mousedown", function(e) {
        Controller.mouseDownEvent(e);
      });
    },

    bindMouseMove: function(canvas) {
      $(canvas).on("mousemove", function(e) {
        Controller.mouseMoveEvent(e);
      });
    },

    bindMouseUp: function() {
      $(document).on("mouseup", function(e) {
        Controller.mouseUpEvent(e);
      });
    },

    bindSocketMessage: function(socket) {
      socket.on('message', function(data) {
        console.log(data.message);
      });
    },

    bindSocketLine: function(socket) {
      socket.on('line', function(data) {
        Controller.socketReceiveLine(data);
      });
    }
  };

  var View = {
    renderLine: function(ctx, point) {
      ctx.strokeStyle = point.color;
      ctx.lineWidth = point.lineWidth;
      ctx.beginPath();
      ctx.moveTo(point.lastPoint.x, point.lastPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  };

  return {
    init: init
  }
})();