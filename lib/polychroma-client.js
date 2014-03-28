var polychroma = (function() {

  var init = function(canvasId) {
    var canvas = $("#" + canvasId)[0];
    canvas.width = 640;
    canvas.height = 400;
    var controller = new Controller(canvas);
  };

  function Point() {
    this.x = 0;
    this.y = 0;
    this.lastPoint = {};
    this.color = "#FFFFFF";
    this.lineWidth = 5;
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

  function Controller(canvas) {
    this.canvas = canvas;
    this.localPoint = new Point();
    this.ctx = canvas.getContext("2d");
    this.socket = this.socketTryConnect();
    this.binder = new Binder(this);
    this.binder.bindAll();
    this.mouseIsDown = false;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  Controller.prototype = {
    socketTryConnect: function() {
      try {
        var socket = io.connect('http://54.186.198.160:5000/');
        return socket;
      } catch(error) {
        console.log("Error message (is server down?): " + error);
        return null;
      }
    },

    mouseDownEvent: function(e) {
      this.localPoint.setPoint(e.offsetX, e.offsetY);
      this.mouseIsDown = true;
    },

    mouseMoveEvent: function(e) {
      if (this.mouseIsDown) {
        if (this.localPoint.distanceTo(e.offsetX, e.offsetY) >= 10) {
          this.localPoint.setPoint(e.offsetX, e.offsetY);
          this.localPoint.setRandomColor();
          View.renderLine(this.ctx, this.localPoint);
          if (this.socket != null) {
            this.socket.emit('line', { line: this.localPoint });
          }
        }
      }
    },

    mouseUpEvent: function(e) {
      this.mouseIsDown = false;
    },

    socketReceiveLine: function(data) {
      View.renderLine(this.ctx, data.line);
    }
  };

  function Binder(controller) {
    this.controller = controller;
  };

  Binder.prototype = {
    bindAll: function() {
      this.bindKeys();
      this.bindSocket();
    },

    bindKeys: function() {
      this.bindMouseDown();
      this.bindMouseMove();
      this.bindMouseUp();
    },

    bindSocket: function() {
      if (this.controller.socket != null) {
        this.bindSocketMessage();
        this.bindSocketLine();
      }
    },

    bindMouseDown: function() {
      $(this.controller.canvas).on("mousedown", function(e) {
        this.controller.mouseDownEvent(e);
      }.bind(this));
    },

    bindMouseMove: function() {
      $(this.controller.canvas).on("mousemove", function(e) {
        this.controller.mouseMoveEvent(e);
      }.bind(this));
    },

    bindMouseUp: function() {
      $(document).on("mouseup", function(e) {
        this.controller.mouseUpEvent(e);
      }.bind(this));
    },

    bindSocketMessage: function() {
      this.controller.socket.on('message', function(data) {
        console.log(data.message);
      });
    },

    bindSocketLine: function() {
      this.controller.socket.on('line', function(data) {
        this.controller.socketReceiveLine(data);
      }.bind(this));
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