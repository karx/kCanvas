import { kCanvas } from "../utils/mycanvas.js";

var canvasHeight;
var canvasWidth;
var kC = new kCanvas("#myCanvas");



function draw() {

    requestAnimationFrame(draw);
}

kC.drawGrid();
draw();
