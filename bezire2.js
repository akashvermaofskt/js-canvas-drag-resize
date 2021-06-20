const utils = {
  distanceXY: function (x0, y0, x1, y1) {
    var dx = x1 - x0,
      dy = y1 - y0;
    return Math.sqrt(dx * dx + dy * dy);
  },

  circlePointCollision: function (x, y, p) {
    console.log(x, y, p.x, p.y, p.h, p.w);
    if (x > p.x && x < p.x + p.w) {
      if (y > p.y - p.h && y < p.y + p.h) {
        return true;
      }
    }
    return false;
  },

  randomNumber: function (min, max) {
    return Math.random() * (max - min) + min;
  },

  getRndColor: function () {
    var r = (255 * Math.random()) | 0,
      g = (255 * Math.random()) | 0,
      b = (255 * Math.random()) | 0;
    return "rgb(" + r + "," + g + "," + b + ")";
  },
};

let offset = {};
let isDragging = false;
let points = [];
let numPoints = 6;
let dragHandle = null;

const types = ["text", "circle", "text", "circle", "circle", "img"];
const color = utils.getRndColor();

function draw(canvas) {
  let context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  function boundary(p) {
    context.beginPath();
    context.moveTo(p.x, p.y);
    context.lineTo(p.x, p.y - p.h);
    context.lineTo(p.x + p.w, p.y - p.h);
    context.lineTo(p.x + p.w, p.y);
    context.closePath();
    context.stroke();
    context.lineWidth = 11;
    context.strokeStyle = "rgba(25, 90, 85, 7.5)";
  }
  function boundaryC(p) {
    context.beginPath();
    context.moveTo(p.x + p.w, p.y);
    context.lineTo(p.x + p.w, p.y + p.h);
    context.lineTo(p.x - p.w, p.y + p.h);
    context.lineTo(p.x - p.w, p.y - p.h);
    context.lineTo(p.x + p.w, p.y - p.h);
    context.closePath();
    context.stroke();
    context.lineWidth = 11;
    context.strokeStyle = "rgba(25, 90, 85, 7.5)";
  }
  function boundaryI(p) {
    context.beginPath();
    context.moveTo(p.x, p.y);
    context.lineTo(p.x, p.y + p.h);
    context.lineTo(p.x + p.w, p.y + p.h);
    context.lineTo(p.x + p.w, p.y);
    context.closePath();
    context.stroke();
    context.lineWidth = 11;
    context.strokeStyle = "rgba(25, 90, 85, 7.5)";
  }

  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  for (let i = 0; i < numPoints; i += 1) {
    let p = points[i];
    if (isDragging && p === dragHandle) {
      context.shadowColor = color;
    }

    context.beginPath();
    if (p.type == "circle") {
      context.arc(p.x, p.y, p.r, 0, Math.PI * 2, false);
      context.fill();
      context.fillStyle = color;
      boundaryC(p);
      context.shadowColor = null;
      context.shadowOffsetX = null;
      context.shadowOffsetY = null;
      context.shadowBlur = null;
    } else if (p.type == "text") {
      context.font = p.h + "px serif";
      context.fillText("Hello world", p.x, p.y, p.w);
      context.fill();
      context.fillStyle = color;
      boundary(p);
    } else if (p.type == "img") {
      let img1 = new Image(); // Image constructor
      img1.src = "https://mdn.mozillademos.org/files/5395/backdrop.png";
      context.drawImage(img1, p.x, p.y, p.w, p.h);
      // console.log(img1);
      boundaryI(p);
    }
  }
}

window.onload = function () {
  let canvas = document.getElementById("canvas");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  for (let i = 0; i < numPoints; i += 1) {
    let p = {
      x: Math.random() * width,
      y: Math.random() * height,
      r: utils.randomNumber(20, 40),
      type: types[i],
      h: 50,
      w: 100,
    };
    points.push(p);
  }
  draw(canvas);

  document.body.addEventListener("mousedown", function (event) {
    for (let i = 0; i < numPoints; i += 1) {
      let p = points[i];
      if (utils.circlePointCollision(event.clientX, event.clientY, p)) {
        isDragging = true;
        document.body.addEventListener("mousemove", onMouseMove);
        document.body.addEventListener("mouseup", onMouseUp);
        dragHandle = p;
        offset.x = event.clientX - p.x;
        offset.y = event.clientY - p.y;
      }
    }
  });
  draw(canvas);

  function onMouseMove(event) {
    dragHandle.x = event.clientX - offset.x;
    dragHandle.y = event.clientY - offset.y;
    draw(canvas);
  }
  function onMouseUp() {
    document.body.removeEventListener("mousemove", onMouseMove);
    document.body.removeEventListener("mouseup", onMouseUp);
    isDragging = false;
    draw(canvas);
  }
};
