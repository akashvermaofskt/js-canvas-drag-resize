var utils = {
  distanceXY: function (x0, y0, x1, y1) {
    var dx = x1 - x0,
      dy = y1 - y0;
    return Math.sqrt(dx * dx + dy * dy);
  },

  /* Add your code Here */

  circlePointCollision: function (x, y, p) {
    // console.log(x, y, p.x, p.y, p.h, p.w);
    if (x > p.x && x < p.x + p.w) {
      if (y > p.y - p.h && y < p.y + p.h) {
        return true;
      }
    }
    return false;
  },
  clickOnTopEdge: function (x, y, p) {
    if (x > p.x && x < p.x + p.w && y > p.y - p.h - b && y < p.y - p.h + b) {
      return true;
    }
    return false;
  },
  clickOnTopEdgeS: function (x, y, p) {
    if (x > p.x && x < p.x + p.w && y > p.y - b && y < p.y + b) {
      return true;
    }
    return false;
  },

  clickOnRightEdge: function (x, y, p) {
    if (y > p.y - p.h && y < p.y && x > p.x + p.w - b && x < p.x + p.w) {
      return true;
    }
    return false;
  },
  clickOnRightEdgeS: function (x, y, p) {
    if (y > p.y && y < p.y + p.h && x > p.x + p.w - b && x < p.x + p.w + b) {
      return true;
    }
    return false;
  },
  clickOnBottomEdge: function (x, y, p) {
    if (x > p.x && x < p.x + p.w && y > p.y - b && y < p.y) {
      return true;
    }
    return false;
  },
  clickOnBottomEdgeS: function (x, y, p) {
    // console.log("BOTTOMS", x, y, p.x, p.y, p.w, p.h);
    if (x > p.x && x < p.x + p.w && y > p.y + p.h - b && y < p.y + p.h + b) {
      return true;
    }
    return false;
  },
  clickOnLeftEdge: function (x, y, p) {
    if (y > p.y - p.h && y < p.y && x > p.x - b && x < p.x + b) {
      return true;
    }
    return false;
  },
  clickOnLeftEdgeS: function (x, y, p) {
    if (y > p.y && y < p.y + p.h && x > p.x - b && x < p.x + b) {
      return true;
    }
    return false;
  },
};

let offset = {};
let isDragging = false;
let dragHandle = null;
let resize = null;
let b = 12;

let points = [];

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
    context.lineWidth = b;
    context.strokeStyle = "rgba(25, 90, 85, 7.5)";
  }
  function boundaryR(p) {
    context.beginPath();
    context.moveTo(p.x, p.y);
    context.lineTo(p.x, p.y + p.h);
    context.lineTo(p.x + p.w, p.y + p.h);
    context.lineTo(p.x + p.w, p.y);
    context.closePath();
    context.stroke();
    context.lineWidth = b;
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
    context.lineWidth = b;
    context.strokeStyle = "rgba(25, 90, 85, 7.5)";
  }
  function boundaryT(p) {
    context.beginPath();
    context.moveTo(p.x, p.y - p.h / 2);
    context.lineTo(p.x + p.w + p.w / 2, p.y - p.h / 2);
    context.lineTo(p.x + p.w + p.w / 2, p.y + p.h + p.h / 2);
    context.lineTo(p.x - p.w / 2, p.y + p.h + p.h / 2);
    context.lineTo(p.x - p.w / 2, p.y - p.h / 2);
    context.closePath();
    context.stroke();
    context.lineWidth = b;
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
    context.lineWidth = b;
    context.strokeStyle = "rgba(25, 90, 85, 7.5)";
  }

  for (let i = 0; i < points.length; i += 1) {
    let p = points[i];

    context.beginPath();
    if (p.type == "circle") {
      context.arc(p.x, p.y, p.radius, p.l1, p.l2, p.async);
      context.fillStyle = p.color;
      context.fill();
      boundaryC(p);
      context.shadowColor = null;
      context.shadowOffsetX = null;
      context.shadowOffsetY = null;
      context.shadowBlur = null;
    } else if (p.type == "triangle") {
      context.moveTo(p.x, p.y);
      context.lineTo(p.x + p.w, p.y);
      context.lineTo(p.x, p.y + p.h);
      context.fillStyle = p.color;
      context.fill();
      boundaryT(p);
    } else if (p.type == "square") {
      context.fill();
      context.fillStyle = p.color;
      context.fillRect(p.x, p.y, p.w, p.h);
      boundaryR(p);
    } else if (p.type == "rectangle") {
      context.fill();
      context.fillStyle = p.color;
      context.fillRect(p.x, p.y, p.w, p.h);
      boundaryR(p);
    } else if (p.type == "text") {
      context.fill();
      context.fillStyle = p.color;
      context.font = p.h + p.font;
      context.fillText(p.value, p.x, p.y, p.w);
      // console.log("text-->" + p.x, p.y);
      boundary(p);
    } else if (p.type == "img") {
      var img1 = new Image(); // Image constructor
      img1.src = p.url;
      context.drawImage(img1, p.x, p.y, p.w, p.h);
      // console.log("img-->" + p.x, p.y, p.w, p.h);
      boundaryI(p);
    }
  }
}

window.onload = function () {
  let canvas = document.getElementById("canvas");
  let width = (canvas.width = window.innerWidth);

  let height = (canvas.height = window.innerHeight);

  points = [
    // {
    //   type: "text",
    //   x: 550,
    //   y: 100,
    //   h: 85,
    //   w: 100,
    //   value: "hello world",
    //   font: "px serif",
    //   color: "yellow",
    // },
    // {
    //   type: "text",
    //   x: 200,
    //   y: 200,
    //   h: 85,
    //   w: 90,
    //   value: "codefree",
    //   font: "px serif",
    //   color: "pink",
    // },

    // {
    //   type: "text",
    //   x: 700,
    //   y: 200,
    //   h: 65,
    //   w: 100,
    //   value: "Pratibha",
    //   font: "px serif",
    //   color: "green",
    // },
    // {
    //   type: "circle",
    //   x: 385,
    //   y: 235,
    //   h: 85,
    //   w: 100,
    //   radius: 50,
    //   l1: 0,
    //   l2: Math.PI * 2,
    //   async: "false",
    //   color: "green",
    // },
    // {
    //   type: "triangle",
    //   x: 336,
    //   y: 336,
    //   h: 100,
    //   w: 100,
    //   color: "red",
    // },
    {
      type: "square",
      x: 536,
      y: 400,
      h: 100,
      w: 100,
      color: "black",
    },
    {
      type: "rectangle",
      x: 736,
      y: 336,
      h: 100,
      w: 150,
      color: "purple",
    },
    {
      type: "img",
      x: 836,
      y: 236,
      w: 85,
      h: 99,
      url: "https://mdn.mozillademos.org/files/5395/backdrop.png",
      color: "red",
    },
  ];

  draw(canvas);

  document.body.addEventListener("mousedown", function (event) {
    console.log("CLICK ", event.clientX, event.clientY);
    for (let i = 0; i < points.length; i += 1) {
      let p = points[i];
      if (
        utils.clickOnTopEdge(event.clientX, event.clientY, p) &&
        p.type == "text"
      ) {
        console.log("top ----> " + event.clientX, event.clientY, p);
        document.body.addEventListener("mousemove", onMouseMove);
        document.body.addEventListener("mouseup", onMouseUp);
        dragHandle = p;
        offset.x = event.clientX - p.x;
        offset.y = event.clientY - p.y;
        p.h = p.y - event.clientY;
        resize = "top";
      } else if (
        utils.clickOnRightEdge(event.clientX, event.clientY, p) &&
        p.type == "text"
      ) {
        console.log("right ----> " + event.clientX, event.clientY, p);
        document.body.addEventListener("mousemove", onMouseMove);
        document.body.addEventListener("mouseup", onMouseUp);
        dragHandle = p;
        offset.x = event.clientX - p.x;
        offset.y = event.clientY - p.y;
        p.w = p.w - event.clientX;
        resize = "right";
      } else if (
        utils.clickOnBottomEdge(event.clientX, event.clientY, p) &&
        p.type == "text"
      ) {
        console.log("....->bottomedge  " + event.clientX, event.clientY, p);
        document.body.addEventListener("mousemove", onMouseMove);
        document.body.addEventListener("mouseup", onMouseUp);
        dragHandle = p;
        offset.x = event.clientX - p.x;
        offset.y = event.clientY - p.y;
        p.h = p.h + (p.y - event.clientY);
        p.y = event.clientY;
        resize = "bottom";
      } else if (
        utils.clickOnLeftEdge(event.clientX, event.clientY, p) &&
        p.type == "text"
      ) {
        console.log("....->leftedge" + event.clientX, event.clientY, p);
        document.body.addEventListener("mousemove", onMouseMove);
        document.body.addEventListener("mouseup", onMouseUp);
        dragHandle = p;
        offset.x = event.clientX - p.x;
        offset.y = event.clientY - p.y;
        p.w = p.w + (p.x - event.clientX);
        p.x = event.clientX;
        resize = "left";
      } else if (utils.clickOnTopEdgeS(event.clientX, event.clientY, p)) {
        console.log("tops ----> " + event.clientX, event.clientY, p);
        document.body.addEventListener("mousemove", onMouseMove);
        document.body.addEventListener("mouseup", onMouseUp);
        dragHandle = p;
        offset.x = event.clientX - p.x;
        offset.y = event.clientY - p.y;
        p.h = p.h + (p.y - event.clientY);
        p.y = event.clientY;
        resize = "topS";
      } else if (utils.clickOnRightEdgeS(event.clientX, event.clientY, p)) {
        console.log("rights ----> " + event.clientX, event.clientY, p);
        document.body.addEventListener("mousemove", onMouseMove);
        document.body.addEventListener("mouseup", onMouseUp);
        dragHandle = p;
        offset.x = event.clientX - p.x;
        offset.y = event.clientY - p.y;
        p.w = event.clientX - p.x;
        // p.x = event.clientX;
        resize = "rightS";
      } else if (utils.clickOnLeftEdgeS(event.clientX, event.clientY, p)) {
        console.log("....->leftedges " + event.clientX, event.clientY, p);
        document.body.addEventListener("mousemove", onMouseMove);
        document.body.addEventListener("mouseup", onMouseUp);
        dragHandle = p;
        offset.x = event.clientX - p.x;
        offset.y = event.clientY - p.y;
        p.w = p.w + (p.x - event.clientX);
        p.x = event.clientX;
        resize = "left";
      } else if (utils.clickOnBottomEdgeS(event.clientX, event.clientY, p)) {
        console.log("....->bottomedgeS  " + event.clientX, event.clientY, p);
        document.body.addEventListener("mousemove", onMouseMove);
        document.body.addEventListener("mouseup", onMouseUp);
        dragHandle = p;
        offset.x = event.clientX - p.x;
        offset.y = event.clientY - p.y;

        p.h = event.clientY - p.y;

        resize = "bottomS";
      } else if (utils.circlePointCollision(event.clientX, event.clientY, p)) {
        console.log("DRAG!");
        isDragging = true;
        document.body.addEventListener("mousemove", onMouseMove);
        document.body.addEventListener("mouseup", onMouseUp);
        dragHandle = p;
        offset.x = event.clientX - p.x;
        offset.y = event.clientY - p.y;
      } else {
        console.log("KUCH NHI HORA!");
      }
    }
  });
  draw(canvas);

  function onMouseMove(event) {
    if (isDragging == true) {
      dragHandle.x = event.clientX - offset.x;
      dragHandle.y = event.clientY - offset.y;
    } else if (resize == "top") {
      dragHandle.h = dragHandle.y - event.clientY;
    } else if (resize == "topS") {
      dragHandle.h = dragHandle.h + dragHandle.y - event.clientY;
      dragHandle.y = event.clientY;
    } else if (resize == "right") {
      dragHandle.w = event.clientX - dragHandle.x;
    } else if (resize == "rightS") {
      dragHandle.w = event.clientX - dragHandle.x;
      // dragHandle.x = event.clientX;
    } else if (resize == "bottom") {
      dragHandle.h = dragHandle.h + dragHandle.y - event.clientY;
      dragHandle.y = event.clientY;
    } else if (resize == "bottomS") {
      dragHandle.h = event.clientY - dragHandle.y;
    } else if (resize == "left") {
      dragHandle.w = dragHandle.w + dragHandle.x - event.clientX;
      dragHandle.x = event.clientX;
    }
    draw(canvas);
  }

  function onMouseUp() {
    document.body.removeEventListener("mousemove", onMouseMove);
    document.body.removeEventListener("mouseup", onMouseUp);
    isDragging = false;
    // resize = null;
    draw(canvas);
  }
};
