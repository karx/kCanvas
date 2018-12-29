var width;
var height;

function setupCanvas(canvas) {
    // Get the device pixel ratio, falling back to 1.
    var dpr = window.devicePixelRatio || 1;
    // Get the size of the canvas in CSS pixels.
    var rect = canvas.getBoundingClientRect();
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    width = canvas.width;
    height = canvas.height;
    var ctx = canvas.getContext('2d');
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    ctx.scale(dpr, dpr);
    return ctx;
  }
  

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var ctx = setupCanvas(document.querySelector('#myCanvas'));



CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x+r, y);
    this.arcTo(x+w, y,   x+w, y+h, r);
    this.arcTo(x+w, y+h, x,   y+h, r);
    this.arcTo(x,   y+h, x,   y,   r);
    this.arcTo(x,   y,   x+w, y,   r);
    this.closePath();
    return this;
  }

var img = new Image();
img.onload = function() {
    ctx.drawImage(img, 0.76 * width, 10, 30, 30);
}
img.src = "./assets/Combined Shape.svg";

ctx.strokeStyle = "#fff";
ctx.fillStyle="rgba(255, 255, 255, 0.25)";
ctx.roundRect(0.057 * width, (70/720) * width , 0.1625 * width ,  0.051 * width, 3.5).stroke();
ctx.roundRect(0.057 * width, (70/720) * width , 0.1625 * width ,  0.051 * width, 3.5).fill();

ctx.roundRect(0.057 * width, (120/720) * width , 0.1625 * width ,  0.051 * width, 3.5).stroke();
ctx.roundRect(0.057 * width, (120/720) * width , 0.1625 * width ,  0.051 * width, 3.5).fill();

ctx.roundRect(0.057 * width, (170/720) * width , 0.1625 * width ,  0.051 * width, 3.5).stroke();
ctx.roundRect(0.057 * width, (170/720) * width , 0.1625 * width ,  0.051 * width, 3.5).fill();

ctx.roundRect(0.057 * width, (220/720) * width , 0.1625 * width ,  0.051 * width, 3.5).stroke();
ctx.roundRect(0.057 * width, (220/720) * width , 0.1625 * width ,  0.051 * width, 3.5).fill();

// ctx.beginPath();
// ctx.moveTo(0.057 * width + 0.1625 * width, (70/720) * width);
// ctx.quadraticCurveTo((200/720) * width, (100/720) * width, (200/720) * width, (180/720) * width);
// ctx.strokeStyle = "#d69448";
// ctx.stroke();