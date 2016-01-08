var polychroma = (function () {

  function MainInitializer() {
    var controller = null;
  }

  MainInitializer.prototype = {
    init: function(canvasId, width, height) {
      var canvas = document.getElementById(canvasId);
      var width = 640;
      var height = 400;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      controller = new Controller(canvas);
      controller.init();
    },

    connect: function(url) {
      controller.socketConnect(url);
    },

    isConnected: function() {
      return !!controller.socket;
    }
  };

  function Point() {
    this.x = 0;
    this.y = 0;
    this.lastPoint = {};
    this.color = "#FFFFFF";
    this.lineWidth = 5;
  }

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
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.socket = null;
    this.isDown = false;
  }

  Controller.prototype = {
    init: function() {
      var localBinder = new LocalBinder(this);
      localBinder.bind();
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    socketConnect: function(url) {
      var scriptUrl = url + "/socket.io/socket.io.js";
      $.ajax({
        type: "GET",
        dataType: "script",
        url: scriptUrl,
        timeout: 1000
      })
        .done(function(data) {
          this.socket = io.connect(url);
          var socketBinder = new SocketBinder(this);
          socketBinder.bind();
        }.bind(this))
        .fail(function(data, error) {
          console.log("Cannot connect to server.");
          console.log(error);
          this.socket = null;
        }.bind(this));
    },

    downEvent: function(e) {
      e = e.originalEvent;
      var x = this.getX(e);
      var y = this.getY(e);
      this.localPoint.setPoint(x, y);
      this.isDown = true;
    },

    moveEvent: function(e) {
      e = e.originalEvent;
      e.preventDefault();
      if (this.isDown) {
        var x = this.getX(e);
        var y = this.getY(e);
        var distanceLimit = 10 * window.devicePixelRatio;
        if (this.localPoint.distanceTo(x, y) >= distanceLimit) {
          this.localPoint.setPoint(x, y);
          this.localPoint.setRandomColor();
          View.renderLine(this.ctx, this.localPoint);
          if (this.socket !== null) {
            this.socket.emit('line', { line: this.localPoint });
          }
        }
      }
    },

    upEvent: function(e) {
      this.isDown = false;
    },

    getX: function(e) {
      if (e.targetTouches)
        return e.targetTouches[0].pageX - this.canvas.offsetLeft;
      else
        return e.pageX - this.canvas.offsetLeft;
    },

    getY: function(e) {
      if (e.targetTouches)
        return e.targetTouches[0].pageY - this.canvas.offsetTop;
      else
        return e.pageY - this.canvas.offsetTop;
    },

    socketReceiveLine: function(data) {
      View.renderLine(this.ctx, data.line);
    }
  };

  function LocalBinder(controller) {
    this.controller = controller;
  }

  LocalBinder.prototype = {
    bind: function() {
      this.bindDown();
      this.bindMove();
      this.bindUp();
    },

    bindDown: function() {
      $(this.controller.canvas).on("touchstart mousedown", function(e) {
        this.controller.downEvent(e);
      }.bind(this));
    },

    bindMove: function() {
      $(this.controller.canvas).on("touchmove mousemove", function(e) {
        this.controller.moveEvent(e);
      }.bind(this));
    },

    bindUp: function() {
      $(this.controller.canvas).on("touchend mouseup", function(e) {
        this.controller.upEvent(e);
      }.bind(this));
    }
  };

  function SocketBinder(controller) {
    this.controller = controller;
  }

  SocketBinder.prototype = {
    bind: function() {
      this.bindSocketMessage();
      this.bindSocketLine();
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

  return new MainInitializer();
})();