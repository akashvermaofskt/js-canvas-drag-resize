var utils = {
    distanceXY: function (x0, y0, x1, y1) {
        var dx = x1 - x0,
            dy = y1 - y0;
        return Math.sqrt(dx * dx + dy * dy);
    },

    /* Add your code Here */

    circlePointCollision: function (x, y, p) {
        console.log(x, y, p.x, p.y, p.h, p.w);
        if (x > p.x && x < p.x + p.w) {
            if (y > p.y - p.h && y < p.y + p.h) {
                return true;
            }
        }
        return false;
    },
}


offset = {},
isDragging = false,
points = [];
numPoints = 6;
 const types=["text","circle","text","circle","circle","img"];

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function getRndColor() {
    var r = 255 * Math.random() | 0,
        g = 255 * Math.random() | 0,
        b = 255 * Math.random() | 0;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

color = getRndColor();
function draw() {
    var canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d")
    context.clearRect(0, 0, canvas.width, canvas.height);
    function boundary() {
        context.beginPath();
        context.moveTo(p.x, p.y);
        context.lineTo(p.x, p.y - p.h);
        context.lineTo(p.x + p.w, p.y - p.h);
        context.lineTo(p.x + p.w, p.y);
        context.closePath();
        context.stroke();
        context.lineWidth = 11;
        context.strokeStyle = 'rgba(25, 90, 85, 7.5)';
    }
    function boundaryC() {
        context.beginPath();
        context.moveTo(p.x + p.w, p.y);
        context.lineTo(p.x + p.w, p.y + p.h);
        context.lineTo(p.x - p.w, p.y + p.h);
        context.lineTo(p.x - p.w, p.y - p.h);
        context.lineTo(p.x + p.w, p.y - p.h);
        context.closePath();
        context.stroke();
        context.lineWidth = 11;
        context.strokeStyle = 'rgba(25, 90, 85, 7.5)';
    }
    function boundaryI() {
        context.beginPath();
        context.moveTo(p.x, p.y);
        context.lineTo(p.x, p.y +p.h);
        context.lineTo(p.x + p.w, p.y + p.h);
        context.lineTo(p.x + p.w, p.y);
        context.closePath();
        context.stroke();
        context.lineWidth = 11;
        context.strokeStyle = 'rgba(25, 90, 85, 7.5)';
    }

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (var i = 0; i < numPoints; i += 1) {
        var p = points[i];
        if (isDragging && p === dragHandle) {
            context.shadowColor = color;
        }

        context.beginPath();
        if (p.type == "circle") {
            context.arc(p.x, p.y, p.r, 0, Math.PI * 2, false);
            context.fill()
            context.fillStyle = color;
            boundaryC();
            context.shadowColor = null;
            context.shadowOffsetX = null;
            context.shadowOffsetY = null;
            context.shadowBlur = null;
        } else if (p.type == "text") {
            context.font = p.h + 'px serif';
            context.fillText('Hello world', p.x, p.y, p.w);
            context.fill()
            context.fillStyle = color;
            boundary();
        } else if (p.type == "img") {
            var img1 = new Image(); // Image constructor
            img1.src = 'https://mdn.mozillademos.org/files/5395/backdrop.png'
            context.drawImage(img1,p.x,p.y,p.w,p.h);
            console.log(img1);
            boundaryI();
        }

    }
}

window.onload = function () {
    width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight;
    for (var i = 0; i < numPoints; i += 1) {
        var p = {
            x: Math.random() * width,
            y: Math.random() * height,
            r: randomNumber(20, 40),
            type: types[i],
            h: 50,
            w: 100,
        };
        points.push(p);
    }
    draw();


    document.body.addEventListener("mousedown", function (event) {
        for (var i = 0; i < numPoints; i += 1) {
            var p = points[i];
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
    draw();

    function onMouseMove(event) {
        dragHandle.x = event.clientX - offset.x;
        dragHandle.y = event.clientY - offset.y;
        draw();
    }
    function onMouseUp(event) {
        document.body.removeEventListener("mousemove", onMouseMove);
        document.body.removeEventListener("mouseup", onMouseUp);
        isDragging = false;
        draw();
    }
}