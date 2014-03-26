var polychroma = (function() {
  const width = 640;
  const height = 400;
  var localPoint, ctx;

  var init = function(canvasId) {
    localPoint = new Point();
    var canvas = $("#" + canvasId)[0];
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    Bindings.bindLocalListeners();
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
    bindLocalListeners: function() {
      var mouseIsDown = false;

      var mouseDown = function(event) {
        localPoint.setPoint(event.offsetX, event.offsetY);
        mouseIsDown = true;
      };

      var mouseMove = function(event) {
        if (mouseIsDown == true && localPoint.distanceToCurrent(event.offsetX, event.offsetY) > 10) {
          localPoint.setPoint(event.offsetX, event.offsetY);
          View.renderLine(localPoint);
        }
      };

      var mouseUp = function(event) {
        mouseIsDown = false;
      };

      $(document).mousedown(mouseDown);
      $(document).mousemove(mouseMove);
      $(document).mouseup(mouseUp);
    }
  };

  var View = {
    renderLine: function(point) {
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