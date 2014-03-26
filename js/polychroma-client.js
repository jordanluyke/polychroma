var polychroma = (function() {
  var localPoint;

  var init = function(canvasId) {
    const canvasWidth = 640;
    const canvasHeight = 400;
    localPoint = new Point();
    var canvas = $("#" + canvasId)[0];
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    Bindings.bindLocalListeners(canvas, ctx);
  };

  function Point() {
    this.x = 0;
    this.y = 0;
    this.lastPoint = {};
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

    distanceToCurrent: function(x, y) {
      return Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2));
    },

    getRandomColor: function() {
      return "#" + Math.floor(Math.random() * 16777215).toString(16); // credit: Paul Irish
    }
  };

  var Bindings = {
    bindLocalListeners: function(canvas, ctx) {
      var mouseIsDown = false;

      var mouseDown = function(event) {
        localPoint.setPoint(event.offsetX, event.offsetY);
        mouseIsDown = true;
      };

      var mouseMove = function(event) {
        if (mouseIsDown) {
          if (localPoint.distanceToCurrent(event.offsetX, event.offsetY) > 10) {
            localPoint.setPoint(event.offsetX, event.offsetY);
            View.renderLine(ctx, localPoint);
          }
        }
      };

      var mouseUp = function(event) {
        mouseIsDown = false;
      };

      $(canvas).mousedown(mouseDown);
      $(canvas).mousemove(mouseMove);
      $(document).mouseup(mouseUp);
    }
  };

  var View = {
    renderLine: function(ctx, point) {
      ctx.strokeStyle = point.getRandomColor();
      ctx.lineWidth = 10;
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